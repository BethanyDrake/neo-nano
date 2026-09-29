'use client'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

const getRandom = (sounds: string) => {
  const arr = sounds.split(',')
  return arr[Math.floor(Math.random() * arr.length)]
}

type Inputs = {
  onset: string
  nucleus: string
  coda: string
  preset: 'english' | 'chinese'
}
const defaultValues = {
  onset: 'qu,w,r,tr,t,y,p,s,sr,st,d,dr,f,fr,g,h,gr,j,k,l,sl,pl,p,pr,z,c,cr,cl,v,b,br,bl,n,m',
  nucleus: 'a,e,i,o,u,ea,oo,ou,ei,ai',
  coda: 'w,r,t,y,p,rp,rt,rg,ss,d,rd,ff,g,h,gh,ck,ll,lk,x,ve,n,rn,m,re,te,pe,se,de,fe,ge,ke,le,ze,ce,ve,be,ne,me,sh',
}

const chinesePreset = {
  onset: 'w,r,t,y,p,d,f,g,h,j,l,z,c,ch,zh,b,n,m',
  nucleus: 'a,e,i,o,u,ü,ai,ou,ao,üe',
  coda: ' ,n,ng',
}

const japanesePreset = {
  onset: ' ,t,s,n,h,m,y,r,w',
  nucleus: 'a,i,u,e,o',
  coda: ' ',
}
const NameGeneratorPage = () => {
  const { register, handleSubmit, setValue } = useForm<Inputs>({ defaultValues })

  const [result, setResult] = useState('')

  const _onSubmit = useCallback((data: Inputs) => {
    const buildWord = (prefix: string, remainingSyllables: number) => {
      if (remainingSyllables === 0) {
        const c = getRandom(data.coda)
        return `${prefix}${c}`
      }
      const o = getRandom(data.onset)
      const n = getRandom(data.nucleus)
      return buildWord(`${prefix}${o}${n}`, remainingSyllables - 1)
    }
    const word = buildWord('', Math.ceil(Math.random() * 3))
    setResult(word)
  }, [])

  const setValues = (data: Omit<Inputs, 'preset'>) => {
    setValue('onset', data.onset)
    setValue('nucleus', data.nucleus)
    setValue('coda', data.coda)
  }

  return (
    <GutteredPage>
      <h1>Name Generator</h1>
      <fieldset>
        <legend>Presets:</legend>

        <input
          id="english-preset"
          {...register('preset')}
          onChange={() => setValues(defaultValues)}
          type="radio"
          value="english-preset"
        />
        <label htmlFor="english-preset">english</label>

        <input
          id="chinese-preset"
          {...register('preset')}
          onChange={() => setValues(chinesePreset)}
          type="radio"
          value="chinese-preset"
        />
        <label htmlFor="chinese-preset">chinese</label>

        <input
          id="japanese-preset"
          {...register('preset')}
          onChange={() => setValues(japanesePreset)}
          type="radio"
          value="japanese-preset"
        />
        <label htmlFor="japanese-preset">japanese</label>
      </fieldset>
      <form onSubmit={handleSubmit(_onSubmit)}>
        <label style={{ fontWeight: 'bold', display: 'block' }} htmlFor="onset">
          Onset:
        </label>
        <textarea style={{ height: '10em', display: 'block' }} id="onset" {...register('onset')} />
        <label style={{ fontWeight: 'bold', display: 'block' }} htmlFor="nucleus">
          Nucleus:
        </label>
        <textarea style={{ height: '10em', display: 'block' }} id="nucleus" {...register('nucleus')} />
        <label style={{ fontWeight: 'bold', display: 'block' }} htmlFor="coda">
          Coda:
        </label>
        <textarea style={{ height: '10em', display: 'block' }} id="coda" {...register('coda')} />
        <button>Generate</button>
      </form>

      <div style={{ textTransform: 'capitalize' }}>{result}</div>
    </GutteredPage>
  )
}

export default NameGeneratorPage
