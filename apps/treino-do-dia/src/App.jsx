import { TreinoDoDia } from './components/TreinoDoDia';

export default function App() {
  return (
    <div className="preview-shell">
      <p className="preview-banner">
        <strong>Preview isolado (React)</strong> — <code>TreinoDoDia</code> +{' '}
        <code>react-body-highlighter</code> · ainda <em>não</em> integrado ao modal Personal &amp; Fitness.
      </p>

      <section className="svc-modal__demo treino-demo">
        <h3 className="svc-modal__demo-title">Treino do Dia</h3>
        <p className="svc-modal__demo-text">
          O aluno vê o grupo muscular do dia e os exercícios — sem abrir outro app.
        </p>
        <TreinoDoDia />
      </section>
    </div>
  );
}
