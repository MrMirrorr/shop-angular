export interface ICategoryListObject {
  data: ICategory[];
  error: string | null;
}

export interface ICategory {
  id: string;
  title: string;
}
