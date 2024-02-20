type Tool =
  | "DUCK_DUCK_GO_SEARCH"
  | "PUBMED"
  | "PYTHON_REPL"
  | "SEMANTIC_SCHOLER"
  | "STACK_EXCHANGE"
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
