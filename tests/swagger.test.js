const { specs, swaggerUi } = require('../src/config/swagger');

describe('Swagger Configuration', () => {
  it('should export swagger specs', () => {
    expect(specs).toBeDefined();
    expect(typeof specs).toBe('object');
  });

  it('should export swagger UI middleware', () => {
    expect(swaggerUi).toBeDefined();
    expect(typeof swaggerUi).toBe('object');
  });

  it('should have valid swagger specification structure', () => {
    expect(specs.openapi).toBeDefined();
    expect(specs.info).toBeDefined();
    expect(specs.info.title).toBeDefined();
    expect(specs.info.version).toBeDefined();
  });

  it('should have servers configuration', () => {
    expect(specs.servers).toBeDefined();
    expect(Array.isArray(specs.servers)).toBe(true);
  });

  it('should have security schemes defined', () => {
    expect(specs.components).toBeDefined();
    expect(specs.components.securitySchemes).toBeDefined();
  });
});
