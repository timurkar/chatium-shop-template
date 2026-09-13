import { jsx } from '@app/html-jsx'
import { Styles } from './styles'
import { SHOP } from './shared/config'

type PageProps = {
  title: string
  description?: string
}

/** HTML-оболочка страницы: head со стилями и body с Vue-компонентом. */
export function Page(props: PageProps, ...children: jsx.JSX.Child[]) {
  const title = props.title ? `${props.title} — ${SHOP.name}` : SHOP.name
  return (
    <html lang="ru">
      <head>
        <meta charset="utf-8" />
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={props.description ?? SHOP.description} />
        <Styles />
      </head>
      <body class="bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  )
}
