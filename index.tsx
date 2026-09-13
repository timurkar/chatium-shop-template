import { indexRoute as shopRoute } from './shop/index'

/** Корень аккаунта: отправляем на витрину магазина. При объединении шаблонов замените на нужный раздел. */
export const rootRoute = app.get('/', async ctx => {
  ctx.resp.redirect(shopRoute.path())
  return ''
})
