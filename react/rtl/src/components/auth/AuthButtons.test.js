import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from '../../test/server';
import AuthButtons from './AuthButtons';

function renderComponent() {
  return render(
    <MemoryRouter>
      <AuthButtons />
    </MemoryRouter>
  );
}

describe('when user is not signed in', () => {
  // createServer() ---> GET '/api/user' ---> { user: null }
  createServer([
    {
      path: '/api/user',
      res: () => {
        return { user: null };
      },
    },
  ]);

  test('sign in and sign up are visible', async () => {
    renderComponent();
    await screen.findAllByRole('link');
  });

  test('sign out is not visible', async () => {
    renderComponent();
    await screen.findAllByRole('link');
  });
});

// describe('when user is signed in', () => {
//   // createServer() ---> GET '/api/user' ---> { user: { id: 3, email: 'asdf@a.com' }}
//   createServer([
//     {
//       path: '/api/user',
//       res: () => {
//         return { user: { id: 3, email: 'asdf@asdf.com' } };
//       },
//     },
//   ]);

//   test('sign in and sign up are not visible', async () => {
//     renderComponent();
//   });
//   test('sign out is visible', async () => {
//     renderComponent();
//   });
// });
