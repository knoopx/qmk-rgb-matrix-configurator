import { useRef, useState, useEffect } from "react"

import IcBaselineCopy from "~icons/ic/baseline-content-copy"

const TextArea = ({
  value,
  showCopy,
  minRows = 4,
  maxRows = 10,
  onChange,
  ...props
}) => {
  const ref = useRef(null)
  const [rows, setRows] = useState(minRows)

  useEffect(() => {
    const { scrollHeight } = ref.current
    const { value: lineHeight } = ref.current
      .computedStyleMap()
      .get("line-height")

    const currentRows = Math.ceil(scrollHeight / lineHeight)
    setRows(Math.min(maxRows, Math.max(currentRows, minRows)))
  }, [value, maxRows, minRows])

  return (
    <div className="relative">
      <textarea
        ref={ref}
        rows={rows}
        className="px-2 py-1 w-full font-mono text-xs whitespace-pre bg-neutral-900 rounded outline-none"
        value={value}
        onChange={onChange}
        {...props}
      />
      {showCopy && (
        <a
          className="block absolute right-0 top-0 m-2 p-2 bg-neutral-600 rounded cursor-pointer"
          onClick={() => navigator.clipboard.writeText(value)}
        >
          <IcBaselineCopy />
        </a>
      )}
    </div>
  )
}

export default TextArea
