import { useState } from 'react'
import PocketBase from 'pocketbase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertTriangle, CheckCircle2, Loader2, X, Download, ZoomIn } from 'lucide-react'

const pb = new PocketBase('https://pb.labtecnosocial.cloud')

interface Props {
  cursoSlug: string
  cursoTitulo: string
}

type MetodoPago = 'bolivia' | 'internacional'
type Estado = 'idle' | 'enviando' | 'exito' | 'error'

export default function InscripcionForm({ cursoSlug, cursoTitulo }: Props) {
  const [apellidos, setApellidos] = useState('')
  const [nombres, setNombres] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [gmail, setGmail] = useState('')
  const [nivelEstudio, setNivelEstudio] = useState('')
  const [profesion, setProfesion] = useState('')
  const [pais, setPais] = useState('')
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('bolivia')
  const [comprobante, setComprobante] = useState<File | null>(null)
  const [estado, setEstado] = useState<Estado>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [qrAbierto, setQrAbierto] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!comprobante) {
      setErrorMsg('Debes subir el comprobante de pago.')
      return
    }
    setEstado('enviando')
    setErrorMsg('')

    const data = new FormData()
    data.append('curso_slug', cursoSlug)
    data.append('curso_titulo', cursoTitulo)
    data.append('apellidos', apellidos)
    data.append('nombres', nombres)
    data.append('whatsapp', whatsapp)
    data.append('gmail', gmail)
    data.append('nivel_estudio', nivelEstudio)
    data.append('profesion', profesion)
    data.append('pais', pais)
    data.append('metodo_pago', metodoPago)
    data.append('comprobante', comprobante)

    try {
      await pb.collection('inscripciones').create(data)
      setEstado('exito')
    } catch (err: any) {
      setEstado('error')
      const detail = err?.response?.data
        ? Object.entries(err.response.data)
            .map(([k, v]: any) => `${k}: ${v?.message ?? v}`)
            .join(' · ')
        : null
      setErrorMsg(detail ?? err?.message ?? 'Ocurrió un error al enviar. Intenta de nuevo.')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setQrAbierto(false)
  }

  if (estado === 'exito') {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center font-body">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <p className="text-lg font-semibold">¡Inscripción recibida!</p>
        <p className="text-sm text-zinc-500">
          Nos pondremos en contacto contigo por WhatsApp o Gmail para confirmar tu lugar.
        </p>
      </div>
    )
  }

  return (
    <>
    {qrAbierto && (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={() => setQrAbierto(false)}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div
          className="relative bg-white rounded-xl p-6 shadow-2xl flex flex-col items-center gap-4 max-w-sm w-full mx-4"
          onClick={e => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setQrAbierto(false)}
            className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-700 transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-sm font-semibold text-zinc-700">QR de pago — 200 Bs</p>
          <img src="/qr.png" alt="QR de pago Bolivia" className="w-64 h-64 object-contain" />
          <a
            href="/qr.png"
            download="qr-pago-bolivia.png"
            className="flex items-center gap-2 rounded-md bg-primary-light text-white px-4 py-2 text-sm font-medium hover:bg-primary-normal transition-colors"
          >
            <Download className="h-4 w-4" />
            Descargar QR
          </a>
        </div>
      </div>
    )}
    <form onSubmit={handleSubmit} className="space-y-4 font-body py-4">
      {/* Aviso cupo mínimo */}
      <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <span>
          El cupo mínimo para la apertura del curso es de <strong>10 personas inscritas</strong>.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Apellidos</label>
          <Input
            required
            value={apellidos}
            onChange={e => setApellidos(e.target.value)}
            placeholder="Ej. Pérez García"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Nombres</label>
          <Input
            required
            value={nombres}
            onChange={e => setNombres(e.target.value)}
            placeholder="Ej. Ana María"
          />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className="text-sm font-medium">País</label>
          <Select required onValueChange={setPais}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu país" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Argentina">Argentina</SelectItem>
              <SelectItem value="Bolivia">Bolivia</SelectItem>
              <SelectItem value="Chile">Chile</SelectItem>
              <SelectItem value="Colombia">Colombia</SelectItem>
              <SelectItem value="Costa Rica">Costa Rica</SelectItem>
              <SelectItem value="Cuba">Cuba</SelectItem>
              <SelectItem value="Ecuador">Ecuador</SelectItem>
              <SelectItem value="El Salvador">El Salvador</SelectItem>
              <SelectItem value="España">España</SelectItem>
              <SelectItem value="Guatemala">Guatemala</SelectItem>
              <SelectItem value="Honduras">Honduras</SelectItem>
              <SelectItem value="México">México</SelectItem>
              <SelectItem value="Nicaragua">Nicaragua</SelectItem>
              <SelectItem value="Panamá">Panamá</SelectItem>
              <SelectItem value="Paraguay">Paraguay</SelectItem>
              <SelectItem value="Perú">Perú</SelectItem>
              <SelectItem value="Puerto Rico">Puerto Rico</SelectItem>
              <SelectItem value="República Dominicana">República Dominicana</SelectItem>
              <SelectItem value="Uruguay">Uruguay</SelectItem>
              <SelectItem value="Venezuela">Venezuela</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">WhatsApp</label>
          <Input
            required
            type="tel"
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
            placeholder="Ej. +591 70000000"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Gmail</label>
          <Input
            required
            type="email"
            value={gmail}
            onChange={e => setGmail(e.target.value)}
            placeholder="correo@gmail.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Nivel de estudio</label>
          <Select required onValueChange={setNivelEstudio}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="estudiante_universitario">Estudiante universitario</SelectItem>
              <SelectItem value="licenciatura">Licenciatura</SelectItem>
              <SelectItem value="maestria">Maestría</SelectItem>
              <SelectItem value="doctorado">Doctorado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Profesión</label>
          <Input
            required
            value={profesion}
            onChange={e => setProfesion(e.target.value)}
            placeholder="Ej. Sociólogo, Comunicador..."
          />
        </div>
      </div>

      {/* Sección de pago */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Método de pago</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setMetodoPago('bolivia')}
            className={`flex-1 rounded-md border px-4 py-2 text-sm transition-colors ${
              metodoPago === 'bolivia'
                ? 'border-primary-normal bg-primary-light/10 text-primary-normal font-semibold'
                : 'border-zinc-200 hover:border-zinc-400'
            }`}
          >
            Bolivia — 200 Bs
          </button>
          <button
            type="button"
            onClick={() => setMetodoPago('internacional')}
            className={`flex-1 rounded-md border px-4 py-2 text-sm transition-colors ${
              metodoPago === 'internacional'
                ? 'border-primary-normal bg-primary-light/10 text-primary-normal font-semibold'
                : 'border-zinc-200 hover:border-zinc-400'
            }`}
          >
            Internacional — $30
          </button>
        </div>

        {metodoPago === 'bolivia' ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <p className="text-sm text-zinc-600">Escanea el QR para pagar <strong>200 Bs</strong>:</p>
            <div className="relative group cursor-pointer" onClick={() => setQrAbierto(true)}>
              <img
                src="/qr.png"
                alt="QR de pago Bolivia"
                className="h-48 w-48 object-contain rounded-md border border-zinc-200 transition-opacity group-hover:opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-8 w-8 text-zinc-700 drop-shadow" />
              </div>
            </div>
            <p className="text-xs text-zinc-400">Clic para ampliar</p>
          </div>
        ) : (
          <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-center space-y-1">
            <p>Realiza el pago de <strong>$30</strong> a través de Airtm:</p>
            <a
              href="https://airtm.me/valeria28newcqg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-primary-normal underline underline-offset-2 font-medium"
            >
              airtm.me/valeria28newcqg
            </a>
          </div>
        )}
      </div>

      {/* Comprobante */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Comprobante de pago (PDF o imagen)</label>
        <Input
          required
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={e => setComprobante(e.target.files?.[0] ?? null)}
          className="cursor-pointer"
        />
        <p className="text-xs text-zinc-400">Formatos admitidos: PDF, JPG, PNG. Máx. 10 MB.</p>
      </div>

      {errorMsg && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      <Button
        type="submit"
        disabled={estado === 'enviando' || !nivelEstudio || !pais}
        className="w-full"
      >
        {estado === 'enviando' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando inscripción...
          </>
        ) : (
          'Enviar inscripción'
        )}
      </Button>
    </form>
    </>
  )
}
