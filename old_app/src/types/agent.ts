type Tool =
  | "DUCK_DUCK_GO_SEARCH"
  | "SEMANTIC_SCHOLER"
  | "WIKIDATA"
  | "WIKIPEDIA"
  | "YAHOO_FINANCE"
  | "YUOUTUBE_SEARCH"
  | "ARXIV"
  | "PUBMED";

export type Agent = {
  id?: number | string;
  role: string;
  goal: string;
  backstory?: string | null;
  tools: Array<Tool>;
  allowDelegation: boolean;
  verbose: boolean;
  memory?: boolean;
  image?: string | null;
};
