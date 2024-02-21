type Tool =
  | "DUCK_DUCK_GO_SEARCH"
  | "SEMANTIC_SCHOLER"
  | "WIKIDATA"
  | "WIKIPEDIA"
  | "YAHOO_FINANCE"
  | "YUOUTUBE_SEARCH";

export type Agent = {
  id?: number;
  role: string;
  goal: string;
  backstory?: string | null;
  tools: Array<Tool>;
  allowDelegation: boolean;
  verbose: boolean;
  image?: string | null;
};
