import { Provision } from './provision.model';

describe('Provision', () => {
  it('should create a provision object', () => {
    const provision: Provision = {
      provisionId: 1,
      name: 'Painting Service',
      description: 'We offer professional painting services.',
      price: 200,
      duration: 120, 
      provider: 'Best Painters Ltd.',
      userId: 123
    };

    expect(provision).toBeTruthy(); 
  });
});
