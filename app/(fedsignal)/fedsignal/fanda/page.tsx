"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Info, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function FAndAPage() {
  const [directCosts, setDirectCosts] = useState("");
  const [rate, setRate] = useState("55");
  const [synced, setSynced] = useState(false);
  
  const direct = parseFloat(directCosts) || 0;
  const fandaRate = parseFloat(rate) || 0;
  const indirect = direct * (fandaRate / 100);
  const total = direct + indirect;

  const syncToPipeline = () => {
    // Get existing workspace or create new
    const existing = sessionStorage.getItem("fs_pipeline_workspace");
    let workspace = existing ? JSON.parse(existing) : {
      sf424: {}, projectNarrative: "", abstract: "",
      keyPersonnel: [], pastPerformance: [], checklist: {},
      createdAt: new Date().toISOString(),
    };
    
    workspace.budgetSummary = {
      directCosts: direct.toString(),
      indirectCosts: indirect.toString(),
      totalCosts: total.toString(),
    };
    workspace.updatedAt = new Date().toISOString();
    
    sessionStorage.setItem("fs_pipeline_workspace", JSON.stringify(workspace));
    setSynced(true);
    setTimeout(() => setSynced(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          F&A Calculator
        </h1>
        <p className="text-muted-foreground">Calculate facilities and administrative costs</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Direct Costs ($)</label>
              <Input 
                type="number" 
                placeholder="Enter direct costs..."
                value={directCosts}
                onChange={(e) => setDirectCosts(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">F&A Rate (%)</label>
              <Input 
                type="number" 
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                <Info className="inline h-3 w-3 mr-1" />
                Check your institution's negotiated rate
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-muted-foreground">Direct Costs</span>
              <span className="font-semibold">${direct.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-muted-foreground">F&A Costs ({fandaRate}%)</span>
              <span className="font-semibold">${indirect.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
              <span className="font-medium">Total Project Cost</span>
              <span className="text-xl font-bold text-primary">${total.toLocaleString()}</span>
            </div>
            
            <div className="pt-4 border-t space-y-2">
              <Button 
                variant="default" 
                className="w-full bg-[#1a56db] hover:bg-[#1547b5]"
                onClick={syncToPipeline}
                disabled={direct === 0}
              >
                {synced ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Synced to Pipeline!
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Sync to Pipeline Budget
                  </>
                )}
              </Button>
              <Link href="/fedsignal/pipeline?step=2">
                <Button variant="outline" size="sm" className="w-full">
                  Go to Pipeline →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
