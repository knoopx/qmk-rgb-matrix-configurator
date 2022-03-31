import classNames from "classnames"

const Palette = ({ activeColor, colors, onSelectColor }) => {
  return (
    <div className="flex flex-wrap space-x-2">
      {colors.map((color) => (
        <button
          key={color}
          className={classNames("rounded w-8 h-8", {
            outline: activeColor == color,
          })}
          style={{ backgroundColor: color }}
          onClick={() => onSelectColor(color)}
        />
      ))}
    </div>
  )
}

export default Palette
