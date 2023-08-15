import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Home from '../app/page';

describe('Sudoku', () => {
  it('renders the component', async () => {
    const { getByTestId, getByRole } = render(<Home />);

    const heading = getByTestId('title').textContent;

    await waitFor(() => {
      getByRole('button', {
        name: 'Puzzle 1',
      });
    });

    expect(heading).toBe('Sudoku-Mobbin');
  });

  it('loads the data from supabase and renders it', async () => {
    const { getByTestId, getByRole } = render(<Home />);
    await waitFor(() => {
      getByRole('button', {
        name: 'Puzzle 1',
      });
    });

    const puzzle1Button = getByRole('button', {
      name: 'Puzzle 1',
    });

    await userEvent.click(puzzle1Button);

    const firstRowFirstCol = getByTestId(`row-col-00`);
    const firstRowSecondCol = getByTestId(`row-col-01`);
    expect(firstRowFirstCol.textContent).toBe('5');
    expect(firstRowSecondCol.textContent).toBe('2');
  });
});
