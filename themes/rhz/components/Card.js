const Card = ({
  children,
  headerSlot,
  className,
  bodyClassName,
  ...rest
}) => {
  const cardClassName = ['rhz-card heo-card card', 'border rounded-xl p-4 lg:p-6', className]
    .filter(Boolean)
    .join(' ')

  const contentClassName = ['rhz-card__body heo-card__body', bodyClassName]
    .filter(Boolean)
    .join(' ')

  return (
    <div {...rest} className={cardClassName}>
      <>{headerSlot}</>
      <section className={contentClassName}>{children}</section>
    </div>
  )
}

export default Card
