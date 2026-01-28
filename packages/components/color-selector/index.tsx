import { Divide } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";

const defaultColors = [
  "#ff0000", // Red
  "#00ff00", // Green
  "#0000ff", // Blue
  "#ffff00", // Yellow
  "#ff00ff", // Magenta
  "#00ffff", // Cyan
];

const ColorSelector = ({ control, errors }: any) => {
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState("#ffffff");
  return (
    <div className="mt-2">
      <label className="block font-semibold mb-1 text-gray-300">Colors</label>
      <Controller
        name="colors"
        control={control}
        render={({ field }) => (
          <div className="flex gap-3 flex-wrap">
            {[...customColors, ...defaultColors].map((color) => {
              const isSelected = (field.value || []).includes(color);
              const isLightColor = ["ffffff", "ffff00"].includes(color); // Checking as dark color can get mixed with background.
              return (
                <button
                  type="button"
                  key={color}
                  onClick={() =>
                    field.onChange(
                      isSelected
                        ? field.value.filter((c: string) => c !== color)
                        : [...(field.value || []), color]
                    )
                  }
                ></button>
              );
            })}
          </div>
        )}
      />
    </div>
  );
};
