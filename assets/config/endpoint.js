export default {
  api: {
    url: "https://momentuumapi.azurewebsites.net/api/",  
    endpoints: {
      login: "auth/login",
      caselist: "case/client/emp",
      casesDetail: {
        caseDetail: "case/",
        caseDetailWithClient: "case/client/emp",
        caseDropdowns: "case/dropdowns",
        caseDetailById: "case/client/",
        stats: "case/stats",
        addSignature: "case/signature"
      },
      caseItems: {
        caseItem: "caseItems/",
        caseItemsForCase: "caseItems/case/"
      },
      fileItem: {
        image: "file/image/",
        caseItemsForCase: "caseItems/case/",
        store: "file/store/"
      },
      test: {
        withAuth: "values/5",
        withoutAuth: "values"
      },
      clientlist: "client/division/",
      employee: "employee/"
    }
  }
};
