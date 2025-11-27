import type {Dispatch, FC, SetStateAction} from 'react'
interface InputViewProps {
  placeholder: string;
  name: string;
  clickhandle?: Dispatch<SetStateAction<any>>;

}
export const InputView : FC<InputViewProps> = ({placeholder, name, clickhandle}) => {
  return (
    <div className='mb-4'>
      <label htmlFor="input-label" className='text-base/normal text-default-200 mb-2 block font-semiblod'>
        {name}
      </label>
      <input type="text" name="" id="input-label" onChange={clickhandle} placeholder={placeholder.toString()}
      className='border-default-200 block w-full rounded border-white/10 bg-transparent py-1.5 px-3 text-white/80 focus:border-white/25 focus:ring-transparent' />
    </div>
  )
}