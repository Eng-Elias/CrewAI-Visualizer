export type Agent = {
  role: string;
  goal: string;
  backstory: string;
  tools: Array<string>;
  allowDelegation: boolean;
  verbose: boolean;
  image: string;
};
