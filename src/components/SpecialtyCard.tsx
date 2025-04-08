
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface SpecialtyCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
}

const SpecialtyCard = ({ name, description, icon }: SpecialtyCardProps) => {
  return (
    <Link 
      to={`/search?specialty=${encodeURIComponent(name)}`}
      className="block transition-transform hover:translate-y-[-5px]"
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            {icon}
          </div>
          <h3 className="text-xl font-medium">{name}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SpecialtyCard;
