import { execFileSync, spawnSync } from 'node:child_process';

const source = 'https://github.com/Benjabb2005/Practicas-Pre-Profesionales-1-Grupo-9.git';
const sourcePage = 'https://github.com/Benjabb2005/Practicas-Pre-Profesionales-1-Grupo-9';
const stages = [
  { n: 2, sha: '08cecb33b0a29e35fa11ed0b029b995a8e0e5b15', branch: 'import-02-rol-sidebar', title: 'Perfil y rol del usuario en la barra lateral', sourcePr: 2 },
  { n: 3, sha: '78ad43cea318d5829eeb1fa14a9b2d4fa983c279', branch: 'import-03-vista-chofer', title: 'Vista del chofer, paradas y registro de pago', sourcePr: 3 },
  { n: 4, sha: 'f62cf3e486c45ef053b7c321ea9e63111b7bcd22', branch: 'import-04-validacion-direcciones', title: 'Validador y normalizador de direcciones', sourcePr: 4 },
  { n: 5, sha: 'da2726816dbfbe07188332ea8a03752f2e662700', branch: 'import-05-georef-localidades', title: 'Integración de Georef, provincias y localidades', sourcePr: 5 },
  { n: 6, sha: '0f153f8771a82700cca5a694ba6bfe3b2dae4663', branch: 'import-06-clientes-pedidos', title: 'Gestión de clientes, pedidos y posibles duplicados', sourcePr: 6 },
  { n: 7, sha: '557936125d99a6ef2dd716024db0f9880c5f5185', branch: 'import-07-geolocalizacion-confirmada', title: 'Geolocalización y confirmación de direcciones', sourcePr: 7 },
  { n: 8, sha: '70b09eab0ab8a3f1d4ca6dc56bcb57732f351072', branch: 'import-08-operacion-entregas', title: 'Operación de entregas, pagos y flujo de chofer', sourcePr: 54 },
  { n: 9, sha: 'b3dc3277d9ab5c187b12bc5cf46d6e89e3988049', branch: 'import-09-sugerencia-envio', title: 'Sugerencia de costo de envío', sourcePr: 55 },
  { n: 10, sha: '10248f4070189d1567d258209d58eeb547706b44', branch: 'import-10-prueba-cruzada', title: 'Documentación de la prueba cruzada de direcciones', sourcePr: 60 },
  { n: 11, sha: 'baa69e1d7f18f07044f767f971675d4b299fce65', branch: 'import-11-previsualizacion-ubicacion', title: 'Previsualización de ubicación antes de guardar', sourcePr: 61 },
  { n: 12, sha: '6b70d2e0f8e1b524eb30fcb8379a55bfda2cad63', branch: 'import-12-exportaciones-y-tarifas', title: 'Pedidos, clientes, exportación PDF y cálculo de envío', sourcePr: 62 },
  { n: 13, sha: 'ab436c4e00a29b4351b85135319c7fc42dfc08f8', branch: 'import-13-experiencia-mvp1', title: 'Integración de la experiencia web MVP-1', sourcePr: 64 },
  { n: 14, sha: '20b831d8e4317b6e721f5e82785caa6fb70c3198', branch: 'import-14-integracion-mvp1', title: 'Integración de MVP-1 y ajuste del mapa del chofer', sourcePr: 65, base: 'main' },
];

const token = process.env.GITHUB_TOKEN;
const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
if (!token || !owner || !repo) throw new Error('Falta el contexto autenticado de GitHub.');
const day = new Date().getUTCDay();
if (![0, 5, 6].includes(day)) throw new Error('La programación solo permite viernes, sábado y domingo.');

const api = async (path, options = {}) => {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`GitHub API ${response.status}: ${body.message ?? 'falló la solicitud'}`);
  return body;
};

const pulls = await api(`/repos/${owner}/${repo}/pulls?state=all&per_page=100`);
const imported = pulls
  .map((pr) => ({ pr, match: /^\[Importación (\d{2})\/14\]/.exec(pr.title) }))
  .filter((entry) => entry.match)
  .sort((a, b) => Number(a.match[1]) - Number(b.match[1]));
const nextNumber = imported.length + 1;
if (nextNumber > 14) {
  console.log('Las 14 PRs históricas ya están registradas.');
  process.exit(0);
}
if (nextNumber === 1) {
  console.log('La primera PR se publica manualmente; se espera su creación antes de continuar.');
  process.exit(0);
}
const stage = stages.find((item) => item.n === nextNumber);
if (!stage) throw new Error(`No hay etapa configurada para ${nextNumber}.`);
const previous = imported.at(-1)?.pr;
if (!previous || Number(imported.at(-1).match[1]) !== nextNumber - 1) {
  throw new Error('Falta una PR anterior; no se altera el orden histórico.');
}
const base = stage.base ?? previous.head.ref;

execFileSync('git', ['fetch', 'origin', previous.head.ref], { stdio: 'inherit' });
execFileSync('git', ['fetch', '--no-tags', source, 'main', 'MVP-1'], { stdio: 'inherit' });
execFileSync('git', ['cat-file', '-e', `${stage.sha}^{commit}`], { stdio: 'inherit' });
execFileSync('git', ['config', 'user.name', 'github-actions[bot]']);
execFileSync('git', ['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
execFileSync('git', ['checkout', '-b', stage.branch, `refs/remotes/origin/${previous.head.ref}`], { stdio: 'inherit' });
const merge = spawnSync('git', ['merge', '--no-ff', '--no-edit', stage.sha], { stdio: 'inherit' });
if (merge.status !== 0) {
  const unmerged = execFileSync('git', ['diff', '--name-only', '--diff-filter=U'], { encoding: 'utf8' })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  if (unmerged.length !== 1 || unmerged[0] !== 'README.md') {
    throw new Error(`Conflicto inesperado al integrar la etapa ${stage.n}: ${unmerged.join(', ')}`);
  }
  execFileSync('git', ['checkout', '--ours', '--', 'README.md']);
  execFileSync('git', ['add', 'README.md']);
  execFileSync('git', ['commit', '--no-edit'], { stdio: 'inherit' });
}
execFileSync('git', ['push', 'origin', `HEAD:refs/heads/${stage.branch}`], { stdio: 'inherit' });

const sourceLink = `${sourcePage}/pull/${stage.sourcePr}`;
const title = `[Importación ${String(stage.n).padStart(2, '0')}/14] ${stage.title}`;
const body = [
  `Esta PR incorpora la etapa ${stage.n} de 14 del historial colaborativo de MandáTodo.`,
  '',
  `**Origen:** [PR #${stage.sourcePr} del repositorio original](${sourceLink}).`,
  `**Commit fuente:** \`${stage.sha}\`.`,
  '',
  'La fecha de esta PR corresponde a la migración a la cuenta Dinaitos; los commits y sus autores conservan los datos históricos originales. Esta publicación no atribuye a Dinaitos el trabajo de los demás integrantes.',
].join('\n');
const created = await api(`/repos/${owner}/${repo}/pulls`, {
  method: 'POST',
  body: JSON.stringify({ title, head: stage.branch, base, body }),
});
console.log(`PR ${created.number} creada: ${created.html_url}`);
