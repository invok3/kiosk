export interface OptionChoice {
  id: string;
  name: string;
  extraPrice: number;
}

export interface ProductOption {
  id: string;
  name: string;
  type: "checkbox" | "radio";
  extraPrice: number;
  required: boolean;
  choices: OptionChoice[];
}
