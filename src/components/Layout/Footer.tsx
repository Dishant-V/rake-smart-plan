import { Link } from "react-router-dom";
import { Factory, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Factory className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">SAIL Rake DSS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered decision support system for optimizing rake formation and dispatch operations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/materials" className="text-muted-foreground hover:text-primary transition-colors">
                  Inventory
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Rake Optimization</li>
              <li>Route Planning</li>
              <li>Inventory Management</li>
              <li>Order Tracking</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@sail.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +91 1800 123 4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ranchi, Jharkhand
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Steel Authority of India Limited (SAIL). All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
