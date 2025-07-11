describe('Header search', () => {
  it('should search for MLA49315128 using the header', () => {
    cy.intercept('GET', '/products/search?q=MLA49315128&offset=0&limit=12', {
      body: {
        paging: {
          offset: 0,
          limit: 10,
          total: 10
        },
        query: 'MLA49315128',
        results: [
          {
            id: 'MLA49315128',
            name: 'Homem Nos Natura 100ml - Masculino - Edp 30% Off - Prt Biene',
            price: null,
            description: 'Homem Nós Masculino \\nEau De Parfum \\nNatura \\nContenido: 100ml \\n\\nPerfume Natura Homem Nós, una fragancia diseñada para el hombre moderno que busca expresar su autenticidad y carisma. Este Eau Parfum de la reconocida marca Natura ofrece una experiencia olfativa única, ideal para quienes valoran la elegancia y la sofisticación en cada detalle de su vida. \\n\\nLa línea Homem se caracteriza por su enfoque en la masculinidad contemporánea, y Nós no es la excepción. Con un aroma que evoca la frescura y la fuerza, este perfume se convierte en un aliado perfecto para cualquier ocasión, ya sea un día en la oficina o una salida nocturna. \\n\\nLa duración de la fragancia asegura que su esencia perdure a lo largo del día, brindando una sensación de confianza y bienestar. Además, Natura se compromete con la sostenibilidad, ofreciendo un producto libre de crueldad y vegano, lo que lo convierte en una elección consciente para el consumidor actual. \\n\\nSumérgete en la experiencia de Natura Homem Nós y permite que su aroma te acompañe en cada paso, reflejando tu personalidad y estilo de vida. Este perfume es más que una fragancia; es una declaración de intenciones para el hombre que sabe lo que quiere.',
            pictures: [
              'https://http2.mlstatic.com/D_NQ_NP_977497-MLA84238785726_052025-F.jpg',
              'https://http2.mlstatic.com/D_NQ_NP_961163-MLA84535725035_052025-F.jpg'
            ],
            priceDiscountPercentage: null,
            isFreeShipping: true,
            attributes: [
              { id: 'BRAND', name: 'Marca', value: 'Natura' },
              { id: 'LINE', name: 'Línea', value: 'Homem' },
              { id: 'PERFUME_NAME', name: 'Nombre del perfume', value: 'NóS' },
              { id: 'GENDER', name: 'Género', value: 'Hombre' }
            ],
            priceWithDiscountApplied: null
          }
        ]
      }
    });

    cy.visit('/');

    // Escribe en el input de búsqueda del header
    cy.get('input[name="query"]').type('MLA49315128');

    // Envía el formulario (puede ser con Enter o click en el botón)
    cy.get('form.header-search').submit();

    // Verifica que la URL cambió a la búsqueda
    cy.url().should('include', '/search?query=MLA49315128');

    // Verifica que el producto aparece en los resultados
    cy.contains('Homem Nos Natura 100ml - Masculino - Edp 30% Off - Prt Biene').should('exist');
  });
});