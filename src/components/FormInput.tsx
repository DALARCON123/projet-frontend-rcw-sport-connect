import React from 'react'
type Props = React.InputHTMLAttributes<HTMLInputElement> & { label: string }
export default function FormInput({ label, ...rest }: Props) {
  return (
    <label className="block mb-3">
      <span className="block text-sm font-semibold mb-1">{label}</span>
      <input {...rest}
        className="w-full rounded-2xl bg-white/80 border border-white/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
    </label>
  )
}
