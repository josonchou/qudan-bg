import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  app.router.post('/login', app.controller.auth.login);
  app.router.post('/upload', app.controller.file.upload);
  app.router.put('/admins/permission', app.controller.admin.put_permission);
  app.router.put('/admins/password/:id', app.controller.admin.updatePassword);
  app.router.resources('admins', '/admins', app.controller.admin);
  
  app.router.put('/users/:id/passRealnameAuth', app.controller.user.passRealnameAuth);
  app.router.put('/users/:id/refuseRealnameAuth', app.controller.user.refuseRealnameAuth);
  app.router.put('/users/:id/passFinanceAuth', app.controller.user.passFinanceAuth);
  app.router.put('/users/:id/refuseFinanceAuth', app.controller.user.refuseFinanceAuth);
  app.router.get('/users/search', app.controller.user.searchUser);
  app.router.get('/users/:id/childs', app.controller.user.queryChildUsers);
  app.router.get('/users/:id/vipInfo', app.controller.user.showVipInfo);
  app.router.get('/users/:id/agentInfo', app.controller.user.showAgentInfo);
  app.router.put('/users/:id/deposit', app.controller.user.deposit);
  // app.router.put('/users/:id', app.controller.user.updateUser);
  app.router.resources('users', '/users', app.controller.user);
  app.router.resources('vipconfigs', '/vipconfigs', app.controller.vipConfigs);
  app.router.resources('banners', '/banners', app.controller.banner);
  app.router.get('/advistors/search', app.controller.customer.search);
  app.router.resources('advistor', '/advistors', app.controller.customer);
  app.router.get('/agents/rewards', app.controller.agent.rewards);
  app.router.get('/agents/childs', app.controller.agent.childs);
  app.router.resources('agent', '/agents', app.controller.agent);
  app.router.resources('agent_config', "/agent_config", app.controller.agentConfig);
  app.router.get('/share_manager/search_products', app.controller.shareManager.searchProducts);
  app.router.resources('share_manager', "/share_manager", app.controller.shareManager);
  app.router.post("/message_store/push/:id", app.controller.message.push);
  app.router.resources('message_store', "/message_store", app.controller.message);
  app.router.put('/orders/:id/pass', app.controller.order.passOne);
  app.router.put('/orders/:id/refuse', app.controller.order.refuseOne);
  app.router.put('/orders/:id/returnDeposit', app.controller.order.returnDeposit);
  app.router.resources('orders', '/orders', app.controller.order);
  app.router.get('/applys/:id/trades', app.controller.apply.trades);
  app.router.put('/applys/:id/shipPos', app.controller.apply.shipPos);
  app.router.put('/applys/:id/signing', app.controller.apply.signing);
  app.router.resources('applys', '/applys', app.controller.apply);
  app.router.resources('categories', '/categories', app.controller.category);
  app.router.resources('product_configs', '/product_configs', app.controller.productConfig);
  app.router.resources('product', '/products', app.controller.product);
  app.router.get('/categories/search', app.controller.category.search);
  app.router.get('/products/links/search', app.controller.product.searchLinks);
  app.router.put('/products/shelf/:id/on', app.controller.product.onShelf);
  app.router.put('/products/shelf/:id/disable', app.controller.product.disableShelf);
  app.router.resources('financials', '/financials', app.controller.financial);
  app.router.get('/financials/salaryList', app.controller.financial.findSalaryList);
  app.router.get('/financials/monthReport', app.controller.financial.monthReport);
  app.router.put('/financials/:id/passOneSalary', app.controller.financial.passOneSalary);
  app.router.put('/financials/:id/refuseOneSalary', app.controller.financial.refuseOneSalary);
  app.router.get('/financials/withdraw', app.controller.financial.withdrawList);
  app.router.get('/financials/posApplyList', app.controller.financial.getPosApplyList);
  app.router.put('/financials/:id/passOneWithdraw', app.controller.financial.passOneWithdraw);
  app.router.put('/financials/:id/refuseOneWithdraw', app.controller.financial.refuseOneWithdraw);
  app.router.put('/financials/:id/finishedWithdraw', app.controller.financial.finishedWithdraw);
  
};
