export interface PaginatorSchematicsInterface<T = any> {
  data: T[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

export class PaginatorSchema {
  static build<T = any>(
    total: number,
    data: T[],
    page: number,
    perPage: number,
  ): PaginatorSchematicsInterface<T> {
    const lastPage = Math.ceil(total / perPage);
    return <PaginatorSchematicsInterface<T>>{
      data,
      meta: {
        total,
        perPage,
        currentPage: ++page,
        lastPage,
      },
    };
  }
}
