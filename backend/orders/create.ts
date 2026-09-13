import { createOrder, OrderError } from '../../server/order-data'

export const orderCreateRoute = app.post('/')
  .body(s => ({
    customerName: s.string().min(1),
    phone: s.string().min(5),
    email: s.string().optional(),
    delivery: s.enum(['courier', 'pickup']),
    address: s.string().optional(),
    comment: s.string().optional(),
    items: s.array(s.object({ id: s.string(), qty: s.number().int().min(1) })),
  }))
  .handle(async (ctx, req) => {
    try {
      const order = await createOrder(ctx, req.body)
      return { ok: true as const, order }
    } catch (err) {
      if (err instanceof OrderError) return { ok: false as const, error: err.message }
      throw err
    }
  })
