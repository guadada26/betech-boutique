export default function DevolucionesPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black lg:px-10">
      <h1 className="text-3xl font-bold">Devoluciones</h1>

      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold">¿Qué plazo tengo para cambiar o devolver un producto?</h2>
        <p>
          Contás con 10 días corridos desde la recepción del producto para solicitar un cambio o devolución, sin costo adicional.
        </p>
        <p>
          En caso de presentar daños estéticos, el reclamo deberá realizarse dentro de las 48 horas de recibido el producto.
        </p>
      </section>

      <hr className="my-8 border-gray-300" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">¿Cómo solicito un cambio o una devolución?</h2>
        <p>
          Podés comunicarte con nuestro equipo de atención al cliente a través de WhatsApp, durante nuestros días y horarios de atención.
        </p>
        <p>WhatsApp:</p>
        <p>+54 9 11 3632-7076</p>
      </section>

      <hr className="my-8 border-gray-300" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">¿En qué condiciones debe estar el producto?</h2>
        <p>Para gestionar un cambio o devolución, el producto debe:</p>
        <ul className="list-disc pl-6">
          <li>No haber sido utilizado.</li>
          <li>Conservar su embalaje original.</li>
          <li>Incluir todos sus accesorios, manuales y etiquetas.</li>
        </ul>
        <p>Los cambios están sujetos a disponibilidad de stock.</p>
        <p>
          En caso de corresponder un reemplazo o reintegro, primero deberá recibirse el producto original para su verificación.
        </p>
      </section>

      <hr className="my-8 border-gray-300" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">¿Qué documentación debo presentar?</h2>
        <p>
          Será necesario presentar la factura o el remito de compra, ya que los cambios y devoluciones se gestionan únicamente contra la
          presentación de alguno de estos comprobantes.
        </p>
      </section>

      <hr className="my-8 border-gray-300" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">¿Qué sucede si ya pasaron los 10 días?</h2>
        <p>
          Una vez transcurrido ese plazo, podrás comunicarte directamente con el servicio técnico autorizado de la marca correspondiente para
          gestionar la reparación o garantía del producto.
        </p>
      </section>

      <hr className="my-8 border-gray-300" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">¿Es obligatorio conservar el embalaje original?</h2>
        <p>
          Sí. Para realizar un cambio o devolución es indispensable que el producto conserve su embalaje original en buen estado, incluyendo:
        </p>
        <ul className="list-disc pl-6">
          <li>Caja original.</li>
          <li>Manuales.</li>
          <li>Accesorios.</li>
          <li>Etiquetas y protecciones correspondientes.</li>
        </ul>
        <p>Esto permite verificar el producto y procesar correctamente el cambio o la devolución.</p>
      </section>
    </main>
  );
}
