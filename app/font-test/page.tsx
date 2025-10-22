export default function FontTestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold mb-8">Font Test Sayfası</h1>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Inter Font (Default)</h2>
          <p className="text-lg">Bu metin Inter font ile yazılmıştır. Normal body text için kullanılır.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-fragor">Fragor Font</h2>
          <p className="text-lg font-fragor">Bu metin Fragor font ile yazılmıştır. Başlıklar için kullanılır.</p>
          <h3 className="text-xl font-semibold font-fragor">Fragor Font Başlık</h3>
          <h4 className="text-lg font-medium font-fragor">Fragor Font Alt Başlık</h4>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-mono">JetBrains Mono (Code)</h2>
          <code className="text-lg font-mono bg-muted p-2 rounded">console.log("Hello World")</code>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 font-fragor">Font Karşılaştırması</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Inter (Normal)</h4>
              <p>Fastreado - Hızlı Okuma Uygulaması</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Fragor (Başlık)</h4>
              <p className="font-fragor">Fastreado - Hızlı Okuma Uygulaması</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}