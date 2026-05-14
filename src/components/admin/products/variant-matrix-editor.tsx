"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Option {
  id: string;
  name: string;
  values: string[];
}

interface Variant {
  title: string;
  price: string;
  inventoryQty: string;
  sku: string;
}

interface VariantMatrixEditorProps {
  onChange: (options: Option[], variants: Variant[]) => void;
}

export function VariantMatrixEditor({ onChange }: VariantMatrixEditorProps) {
  const [options, setOptions] = useState<Option[]>([
    { id: "1", name: "Size", values: [] },
  ]);
  const [variants, setVariants] = useState<Variant[]>([]);

  const addOption = () => {
    setOptions([...options, { id: Date.now().toString(), name: "", values: [] }]);
  };

  const removeOption = (id: string) => {
    setOptions(options.filter(o => o.id !== id));
  };

  const updateOptionName = (id: string, name: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, name } : o));
  };

  const updateOptionValues = (id: string, valueStr: string) => {
    const values = valueStr.split(",").map(v => v.trim()).filter(v => v !== "");
    setOptions(options.map(o => o.id === id ? { ...o, values } : o));
  };

  useEffect(() => {
    // Generate Cartesian product of all option values
    const generateVariants = () => {
      const activeOptions = options.filter(o => o.name && o.values.length > 0);
      if (activeOptions.length === 0) return [];

      const cartesian = (args: string[][]): string[][] => {
        const result: string[][] = [];
        const max = args.length - 1;
        function helper(arr: string[], i: number) {
          for (let j = 0, l = args[i].length; j < l; j++) {
            const a = arr.slice(0);
            a.push(args[i][j]);
            if (i === max) result.push(a);
            else helper(a, i + 1);
          }
        }
        helper([], 0);
        return result;
      };

      const combinations = cartesian(activeOptions.map(o => o.values));
      return combinations.map(combo => {
        const title = combo.join(" / ");
        // Preserve existing data if possible
        const existing = variants.find(v => v.title === title);
        return existing || {
          title,
          price: "0.00",
          inventoryQty: "0",
          sku: "",
        };
      });
    };

    const newVariants = generateVariants();
    setVariants(newVariants);
    onChange(options, newVariants);
  }, [options]);

  const updateVariant = (index: number, field: keyof Variant, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
    onChange(options, newVariants);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {options.map((option, index) => (
          <div key={option.id} className="flex items-start gap-4 p-4 rounded-lg border bg-slate-50/50 group">
            <div className="pt-2 text-slate-400">
              <GripVertical className="w-4 h-4 cursor-grab" />
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500">Option Name</Label>
                <Input 
                  placeholder="e.g. Size, Color" 
                  value={option.name}
                  onChange={(e) => updateOptionName(option.id, e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500">Values (comma separated)</Label>
                <Input 
                  placeholder="e.g. S, M, L" 
                  defaultValue={option.values.join(", ")}
                  onBlur={(e) => updateOptionValues(option.id, e.target.value)}
                  className="bg-white"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {option.values.map(val => (
                    <Badge key={val} variant="secondary" className="font-normal">{val}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeOption(option.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addOption} className="w-full border-dashed">
          <Plus className="w-4 h-4 mr-2" />
          Add another option
        </Button>
      </div>

      {variants.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Variant Combinations
            </h3>
            <span className="text-xs text-slate-500">{variants.length} total variants</span>
          </div>
          <div className="border rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-[200px]">Variant</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>SKU</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant, index) => (
                  <TableRow key={variant.title}>
                    <TableCell className="font-medium text-sm">{variant.title}</TableCell>
                    <TableCell>
                      <Input 
                        value={variant.price}
                        onChange={(e) => updateVariant(index, "price", e.target.value)}
                        className="h-8 w-24 text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={variant.inventoryQty}
                        onChange={(e) => updateVariant(index, "inventoryQty", e.target.value)}
                        className="h-8 w-20 text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, "sku", e.target.value)}
                        className="h-8"
                        placeholder="SKU"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
