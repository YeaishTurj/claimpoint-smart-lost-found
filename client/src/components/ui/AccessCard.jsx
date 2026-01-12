import React from "react";
import { useNavigate } from "react-router";
import Card from "./Card";
import Button from "./Button";

export default function AccessCard({
  icon: Icon,
  title = "Access Required",
  description = "Please log in to continue.",
  actionLabel = "Go to Login",
  actionTo = "/login",
}) {
  const navigate = useNavigate();

  return (
    <Card className="p-8 text-center">
      {Icon ? (
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon size={36} className="text-emerald-400" />
        </div>
      ) : null}
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-400 mb-7 text-sm leading-relaxed">
        {description}
      </p>
      <Button className="w-full" onClick={() => navigate(actionTo)}>
        {actionLabel}
      </Button>
    </Card>
  );
}
