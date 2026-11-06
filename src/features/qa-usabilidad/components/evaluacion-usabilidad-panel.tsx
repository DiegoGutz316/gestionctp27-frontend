"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Home, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/context/auth-context";

import {
  ETIQUETA_MODULO,
  ETIQUETA_RESULTADO,
  type CatalogoUsab,
  type ParticipanteUsab,
  type ResultadoUsab,
  type RolPerfilParticipante,
  type ResumenUsab,
  type SesionUsab,
} from "../models/qa-usabilidad.model";
import {
  adjuntarEvidenciaUsab,
  actualizarSesionUsab,
  crearParticipanteUsab,
  crearSesionUsab,
  descargarEvidenciaUsab,
  descargarInformeUsab,
  finalizarSesionUsab,
  getMensajeDeError,
  listarParticipantesUsab,
  listarSesionesUsab,
  obtenerCatalogoUsab,
  obtenerResumenUsab,
} from "../servicios/qa-usabilidad.service";

const RESULTADOS = Object.keys(ETIQUETA_RESULTADO) as ResultadoUsab[];
const ROLES: RolPerfilParticipante[] = [
  "DOCENTE_PECUARIO",
  "DOCENTE_AGRICOLA",
  "DIRECTORA",
  "OTRO",
];

function hoyIso() {
  return new Date().toISOString().slice(0, 10);
}

export function EvaluacionUsabilidadPanel() {
  const { usuario } = useAuth();
  const [catalogo, setCatalogo] = useState<CatalogoUsab | null>(null);
  const [resumen, setResumen] = useState<ResumenUsab | null>(null);
  const [participantes, setParticipantes] = useState<ParticipanteUsab[]>([]);
  const [sesiones, setSesiones] = useState<SesionUsab[]>([]);
  const [cargando, setCargando] = useState(true);

  const [codigo, setCodigo] = useState("DOC-01");
  const [rolPerfil, setRolPerfil] =
    useState<RolPerfilParticipante>("DOCENTE_PECUARIO");
  const [notasParticipante, setNotasParticipante] = useState("");

  const [participanteId, setParticipanteId] = useState<string>("");
  const [pruebaCodigo, setPruebaCodigo] = useState("USAB-01");
  const [fechaEjecucion, setFechaEjecucion] = useState(hoyIso());
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [tiempoMinutos, setTiempoMinutos] = useState("");
  const [resultado, setResultado] = useState<ResultadoUsab | "">("");
  const [errores, setErrores] = useState("0");
  const [ayudas, setAyudas] = useState("0");
  const [observaciones, setObservaciones] = useState("");

  const [sesionSeleccionada, setSesionSeleccionada] = useState<number | null>(
    null,
  );
  const [motivoCambio, setMotivoCambio] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);

  const esAdmin = usuario?.rol === "ADMINISTRADOR";

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [c, r, p, s] = await Promise.all([
        obtenerCatalogoUsab(),
        obtenerResumenUsab(),
        listarParticipantesUsab(),
        listarSesionesUsab(),
      ]);
      setCatalogo(c);
      setResumen(r);
      setParticipantes(p);
      setSesiones(s);
      setParticipanteId((prev) => prev || (p[0] ? String(p[0].id) : ""));
    } catch (error) {
      toast.error(getMensajeDeError(error));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (esAdmin) void cargar();
  }, [esAdmin, cargar]);

  const pruebasPorModulo = useMemo(() => {
    if (!catalogo) return [];
    const orden: Array<keyof typeof ETIQUETA_MODULO> = [
      "LIBRO_CAJA",
      "PECUARIA",
      "AGRICOLA",
      "REPORTES_AVISOS",
    ];
    return orden.map((modulo) => ({
      modulo,
      etiqueta: ETIQUETA_MODULO[modulo],
      pruebas: catalogo.pruebas.filter((p) => p.modulo === modulo),
    }));
  }, [catalogo]);

  if (!esAdmin) {
    return (
      <section className="mx-auto max-w-3xl p-6">
        <p className="text-sm text-muted-foreground">
          Esta sección solo está disponible para el administrador de
          evaluaciones QA.
        </p>
      </section>
    );
  }

  async function onCrearParticipante(e: React.FormEvent) {
    e.preventDefault();
    try {
      const creado = await crearParticipanteUsab({
        codigo,
        rolPerfil,
        notas: notasParticipante || undefined,
      });
      toast.success(`Participante ${creado.codigo} registrado`);
      setNotasParticipante("");
      await cargar();
      setParticipanteId(String(creado.id));
    } catch (error) {
      toast.error(getMensajeDeError(error));
    }
  }

  async function onCrearSesion(e: React.FormEvent) {
    e.preventDefault();
    if (!participanteId) {
      toast.error("Registre o seleccione un participante.");
      return;
    }
    try {
      const sesion = await crearSesionUsab({
        participanteId: Number(participanteId),
        pruebaCodigo,
        fechaEjecucion,
        horaInicio: horaInicio || undefined,
        horaFin: horaFin || undefined,
        tiempoMinutos: tiempoMinutos ? Number(tiempoMinutos) : undefined,
        resultado: resultado || undefined,
        errores: Number(errores) || 0,
        ayudas: Number(ayudas) || 0,
        observaciones: observaciones || undefined,
      });
      toast.success(`Sesión #${sesion.id} creada en borrador`);
      setSesionSeleccionada(sesion.id);
      setObservaciones("");
      await cargar();
    } catch (error) {
      toast.error(getMensajeDeError(error));
    }
  }

  async function onFinalizar(id: number) {
    try {
      await finalizarSesionUsab(id);
      toast.success(`Sesión #${id} finalizada`);
      await cargar();
    } catch (error) {
      toast.error(getMensajeDeError(error));
    }
  }

  async function onActualizarSeleccionada() {
    if (!sesionSeleccionada) return;
    const sesion = sesiones.find((s) => s.id === sesionSeleccionada);
    try {
      await actualizarSesionUsab(sesionSeleccionada, {
        horaInicio: horaInicio || undefined,
        horaFin: horaFin || undefined,
        tiempoMinutos: tiempoMinutos ? Number(tiempoMinutos) : undefined,
        resultado: resultado || undefined,
        errores: Number(errores) || 0,
        ayudas: Number(ayudas) || 0,
        observaciones: observaciones || undefined,
        motivoCambio:
          sesion?.estado === "FINALIZADA" ? motivoCambio : undefined,
      });
      toast.success("Sesión actualizada");
      setMotivoCambio("");
      await cargar();
    } catch (error) {
      toast.error(getMensajeDeError(error));
    }
  }

  async function onAdjuntar() {
    if (!sesionSeleccionada || !archivo) {
      toast.error("Seleccione sesión y archivo (PNG/JPEG/WebP/PDF ≤ 5 MB).");
      return;
    }
    try {
      await adjuntarEvidenciaUsab(sesionSeleccionada, archivo);
      toast.success("Evidencia adjuntada");
      setArchivo(null);
      await cargar();
    } catch (error) {
      toast.error(getMensajeDeError(error));
    }
  }

  async function onExportar() {
    try {
      await descargarInformeUsab();
      toast.success("Informe descargado");
    } catch (error) {
      toast.error(getMensajeDeError(error));
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 pb-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard" className="inline-flex items-center gap-1">
              <Home className="size-3.5" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Evaluación de usabilidad</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Evaluación de usabilidad
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Registro de sesiones reales USAB-01…10. El piloto técnico no se
            mezcla con estas estadísticas ni marca las pruebas como aprobadas.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => void cargar()}>
            <RefreshCw className="size-4" />
            Actualizar
          </Button>
          <Button type="button" onClick={() => void onExportar()}>
            <Download className="size-4" />
            Exportar informe
          </Button>
        </div>
      </header>

      {cargando && !resumen ? (
        <p className="text-sm text-muted-foreground">Cargando panel QA…</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi titulo="Pruebas definidas" valor={resumen?.pruebasDefinidas ?? 10} />
            <Kpi titulo="Sesiones reales" valor={resumen?.sesionesReales ?? 0} />
            <Kpi titulo="Participantes" valor={resumen?.participantes ?? 0} />
            <Kpi titulo="Evidencias" valor={resumen?.evidencias ?? 0} />
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/40">
            <p className="font-medium">Piloto técnico (separado)</p>
            <p className="mt-1 text-muted-foreground">
              {resumen?.pilotoTecnico.descripcion ??
                catalogo?.pilotoTecnico.descripcion}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ref: {resumen?.pilotoTecnico.referencia}
            </p>
          </div>

          {(resumen?.sesionesReales ?? 0) === 0 && (
            <div className="rounded-lg border border-dashed p-4 text-sm">
              <strong>Pruebas con usuarios reales: pendientes.</strong> No hay
              sesiones auténticas registradas todavía.
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <form
              onSubmit={onCrearParticipante}
              className="flex flex-col gap-3 rounded-lg border p-4"
            >
              <h2 className="font-medium">Registrar participante</h2>
              <p className="text-xs text-muted-foreground">
                Use códigos anónimos (DOC-01, DIR-01). No guarde nombres ni
                cédulas.
              </p>
              <div className="grid gap-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rol-perfil">Rol de perfil</Label>
                <select
                  id="rol-perfil"
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  value={rolPerfil}
                  onChange={(e) =>
                    setRolPerfil(e.target.value as RolPerfilParticipante)
                  }
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notas-p">Notas (opcional)</Label>
                <Input
                  id="notas-p"
                  value={notasParticipante}
                  onChange={(e) => setNotasParticipante(e.target.value)}
                  maxLength={250}
                />
              </div>
              <Button type="submit">Guardar participante</Button>
            </form>

            <form
              onSubmit={onCrearSesion}
              className="flex flex-col gap-3 rounded-lg border p-4"
            >
              <h2 className="font-medium">Registrar ejecución</h2>
              <div className="grid gap-2">
                <Label htmlFor="part">Participante</Label>
                <select
                  id="part"
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  value={participanteId}
                  onChange={(e) => setParticipanteId(e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  {participantes.map((p) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.codigo} ({p.rolPerfil})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prueba">Prueba</Label>
                <select
                  id="prueba"
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  value={pruebaCodigo}
                  onChange={(e) => setPruebaCodigo(e.target.value)}
                >
                  {(catalogo?.pruebas ?? []).map((p) => (
                    <option key={p.codigo} value={p.codigo}>
                      {p.codigo} — {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={fechaEjecucion}
                    onChange={(e) => setFechaEjecucion(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tiempo">Tiempo (min)</Label>
                  <Input
                    id="tiempo"
                    type="number"
                    min={0}
                    step="0.5"
                    value={tiempoMinutos}
                    onChange={(e) => setTiempoMinutos(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="hi">Hora inicio</Label>
                  <Input
                    id="hi"
                    placeholder="09:15"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hf">Hora fin</Label>
                  <Input
                    id="hf"
                    placeholder="09:32"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="resultado">Resultado</Label>
                <select
                  id="resultado"
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  value={resultado}
                  onChange={(e) =>
                    setResultado(e.target.value as ResultadoUsab | "")
                  }
                >
                  <option value="">Pendiente de indicar</option>
                  {RESULTADOS.map((r) => (
                    <option key={r} value={r}>
                      {ETIQUETA_RESULTADO[r]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="err">Errores</Label>
                  <Input
                    id="err"
                    type="number"
                    min={0}
                    value={errores}
                    onChange={(e) => setErrores(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ayu">Ayudas</Label>
                  <Input
                    id="ayu"
                    type="number"
                    min={0}
                    value={ayudas}
                    onChange={(e) => setAyudas(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="obs">Observaciones</Label>
                <Textarea
                  id="obs"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={3}
                />
              </div>
              <Button type="submit">Crear sesión (borrador)</Button>
            </form>
          </div>

          <section className="flex flex-col gap-3">
            <h2 className="font-medium">Pruebas por módulo</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {pruebasPorModulo.map((bloque) => (
                <div key={bloque.modulo} className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium">{bloque.etiqueta}</h3>
                    <Badge variant="secondary">
                      {bloque.pruebas.length} pruebas
                    </Badge>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {bloque.pruebas.map((p) => {
                      const pendiente =
                        resumen?.pruebasPendientesSinSesion.includes(p.codigo);
                      return (
                        <li
                          key={p.codigo}
                          className="flex items-start justify-between gap-2"
                        >
                          <span>
                            <span className="font-mono text-xs">{p.codigo}</span>{" "}
                            {p.nombre}
                          </span>
                          <Badge variant={pendiente ? "outline" : "default"}>
                            {pendiente ? "Pendiente" : "Con sesión"}
                          </Badge>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-medium">Sesiones registradas</h2>
            {sesiones.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aún no hay sesiones. Los participantes realizan las tareas en
                los módulos normales; aquí solo se registra la evidencia.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Prueba</th>
                      <th className="p-2">Participante</th>
                      <th className="p-2">Fecha</th>
                      <th className="p-2">Resultado</th>
                      <th className="p-2">Estado</th>
                      <th className="p-2">Evid.</th>
                      <th className="p-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sesiones.map((s) => (
                      <tr key={s.id} className="border-b last:border-0">
                        <td className="p-2">{s.id}</td>
                        <td className="p-2 font-mono text-xs">{s.pruebaCodigo}</td>
                        <td className="p-2">{s.participante.codigo}</td>
                        <td className="p-2">{s.fechaEjecucion}</td>
                        <td className="p-2">
                          {s.etiquetaResultado ?? "—"}
                        </td>
                        <td className="p-2">
                          <Badge
                            variant={
                              s.estado === "FINALIZADA" ? "default" : "outline"
                            }
                          >
                            {s.estado}
                          </Badge>
                        </td>
                        <td className="p-2">{s.evidencias.length}</td>
                        <td className="p-2">
                          <div className="flex flex-wrap gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSesionSeleccionada(s.id);
                                setResultado(s.resultado ?? "");
                                setErrores(String(s.errores));
                                setAyudas(String(s.ayudas));
                                setHoraInicio(s.horaInicio ?? "");
                                setHoraFin(s.horaFin ?? "");
                                setTiempoMinutos(
                                  s.tiempoMinutos != null
                                    ? String(s.tiempoMinutos)
                                    : "",
                                );
                                setObservaciones(s.observaciones ?? "");
                              }}
                            >
                              Seleccionar
                            </Button>
                            {s.estado === "BORRADOR" && (
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => void onFinalizar(s.id)}
                              >
                                Finalizar
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {sesionSeleccionada != null && (
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">
                  Sesión seleccionada #{sesionSeleccionada}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Actualice campos del formulario de ejecución y guarde. Si la
                  sesión ya está finalizada, indique el motivo del cambio.
                </p>
                <div className="mt-3 grid gap-2">
                  <Label htmlFor="motivo">Motivo de cambio (si finalizada)</Label>
                  <Input
                    id="motivo"
                    value={motivoCambio}
                    onChange={(e) => setMotivoCambio(e.target.value)}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" onClick={() => void onActualizarSeleccionada()}>
                    Guardar cambios
                  </Button>
                </div>
                <div className="mt-4 grid gap-2">
                  <Label htmlFor="evid">Adjuntar evidencia</Label>
                  <Input
                    id="evid"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,application/pdf"
                    onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
                  />
                  <Button type="button" variant="outline" onClick={() => void onAdjuntar()}>
                    Subir evidencia
                  </Button>
                </div>
                <ul className="mt-3 space-y-1 text-sm">
                  {sesiones
                    .find((s) => s.id === sesionSeleccionada)
                    ?.evidencias.map((ev) => (
                      <li key={ev.id}>
                        <button
                          type="button"
                          className="text-primary underline-offset-2 hover:underline"
                          onClick={() =>
                            void descargarEvidenciaUsab(ev.id, ev.nombreArchivo)
                          }
                        >
                          {ev.nombreArchivo}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}

function Kpi({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs text-muted-foreground">{titulo}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{valor}</p>
    </div>
  );
}
