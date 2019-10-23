import createPlugin from "logrocket-vuex";
import LogRocket from "logrocket";

export default createPlugin(LogRocket, mutation => {
  //   debugger;
  return mutation;
});
