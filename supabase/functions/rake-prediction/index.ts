import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error('Supabase credentials not configured');

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Fetch new orders with material details
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        quantity_tons,
        delivery_location,
        deadline,
        priority,
        materials (name, material_code)
      `)
      .eq('status', 'new')
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    // Fetch plants and warehouses
    const { data: plants } = await supabase.from('plants').select('*');
    const { data: warehouses } = await supabase.from('warehouses').select('*');
    const { data: rakes } = await supabase.from('rakes').select('*');
    const { data: wagonTypes } = await supabase.from('wagon_types').select('*');

    // Build context for AI
    const context = `
    NEW ORDERS:
    ${orders?.map((o: any) => `
    - Order ID: ${o.id}
    - Material: ${o.materials?.name || 'Unknown'} (${o.materials?.material_code || 'N/A'})
    - Quantity: ${o.quantity_tons} tons
    - Delivery Location: ${o.delivery_location}
    - Deadline: ${o.deadline}
    - Priority: ${o.priority || 'medium'}
    `).join('\n')}

    AVAILABLE PLANTS: ${plants?.map(p => `${p.name} at ${p.location}`).join(', ')}
    AVAILABLE WAREHOUSES: ${warehouses?.map(w => `${w.name} at ${w.location} (${w.capacity_tons} tons capacity)`).join(', ')}
    AVAILABLE RAKES: ${rakes?.length || 0} rakes (${rakes?.[0]?.min_rake_size_tons}-${rakes?.[0]?.max_rake_size_tons} tons capacity)
    WAGON TYPES: ${wagonTypes?.map(w => `${w.type_name} (${w.capacity_ton} tons)`).join(', ')}
    `;

    // Call Lovable AI for rake optimization
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an AI optimization expert for SAIL steel logistics. Analyze orders and generate optimized rake dispatch plans. 
            
            For each order, provide:
            1. Optimal pickup location (closest plant/warehouse with inventory)
            2. Ideal route from pickup to delivery
            3. Wagon composition (types and count based on tonnage)
            4. Estimated delivery date considering distance and current date
            5. Total cost breakdown
            
            Format your response as a structured JSON array with these fields for each prediction:
            - orderId
            - materialName
            - quantity
            - deliveryLocation
            - pickupLocation (closest plant/warehouse)
            - route (origin -> destination with distance)
            - wagonAssignment (array of wagon types and counts)
            - estimatedDeliveryDate
            - estimatedDeliveryDays
            - totalCost
            - costBreakdown (object with material, transport, handling costs)`
          },
          {
            role: 'user',
            content: `Analyze these orders and generate optimization plan:\n${context}\n\nProvide response as valid JSON array only, no markdown.`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;
    
    // Clean up markdown formatting if present
    aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let predictions;
    try {
      predictions = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      predictions = []; // Fallback to empty array
    }

    return new Response(JSON.stringify({ 
      success: true, 
      predictions,
      orderCount: orders?.length || 0 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in rake-prediction:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
