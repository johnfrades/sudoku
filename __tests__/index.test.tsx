import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Home from '../app/page';
import { mockData } from '@/mocks/mocks';

jest.mock('../utils/supabaseClient.ts', () => ({
  __esModule: true,
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        data: mockData,
      })),
    })),
  },
}));

describe('Sudoku', () => {
  it('renders the component', async () => {
    const { getByTestId } = render(<Home />);

    const heading = getByTestId('title').textContent;
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
    const puzzle2Button = getByRole('button', {
      name: 'Puzzle 2',
    });
    await userEvent.click(puzzle1Button);

    expect(getByTestId(`row-col-00`).textContent).toBe('5');
    expect(getByTestId(`row-col-01`).textContent).toBe('2');

    await userEvent.click(puzzle2Button);
    expect(getByTestId(`row-col-00`).textContent).toBe('8');
    expect(getByTestId(`row-col-01`).textContent).toBe('3');
  });

  it(
    'loads the Puzzle 1 and solves it',
    async () => {
      const { getByTestId, getByRole } = render(<Home />);
      await waitFor(() => {
        getByRole('button', {
          name: 'Puzzle 1',
        });
      });

      const puzzle1Button = getByRole('button', {
        name: 'Puzzle 1',
      });
      const solveIt = getByRole('button', {
        name: 'Solve It',
      });
      await userEvent.click(puzzle1Button);
      await userEvent.click(solveIt);

      // Expected board
      // | 5 2 7 |
      // | 8 9 6 |
      // | 3 1 4 |
      expect(getByTestId(`row-col-00`).textContent).toBe('5');
      expect(getByTestId(`row-col-01`).textContent).toBe('2');
      expect(getByTestId(`row-col-02`).textContent).toBe('7');
      expect(getByTestId(`row-col-10`).textContent).toBe('8');
      expect(getByTestId(`row-col-11`).textContent).toBe('9');
      expect(getByTestId(`row-col-12`).textContent).toBe('6');
      expect(getByTestId(`row-col-20`).textContent).toBe('3');
      expect(getByTestId(`row-col-21`).textContent).toBe('1');
      expect(getByTestId(`row-col-22`).textContent).toBe('4');
    },
    60 * 1000
  );

  it('should able to enter a number on the field and show an error border', async () => {
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
    await userEvent.click(getByTestId(`row-col-02`));

    await waitFor(() => getByTestId('numpad-box'));

    const numpad2 = getByRole('button', {
      name: '2',
    });

    await userEvent.click(numpad2);

    expect(getByTestId(`row-col-02`).textContent).toBe('2');
    expect(
      getByTestId(`row-col-02`).classList.contains('border-red-500')
    ).toBeTruthy();
    expect(
      getByTestId(`row-col-01`).classList.contains('border-red-500')
    ).toBeTruthy();
  });

  it('should able to clear the board and the error border', async () => {
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
    await userEvent.click(getByTestId(`row-col-02`));

    await waitFor(() => getByTestId('numpad-box'));

    const numpad2 = getByRole('button', {
      name: '2',
    });

    const clearBoard = getByRole('button', {
      name: 'Clear Board',
    });

    await userEvent.click(numpad2);

    expect(getByTestId(`row-col-02`).textContent).toBe('2');

    await userEvent.click(clearBoard);

    expect(
      getByTestId(`row-col-02`).classList.contains('border-red-500')
    ).toBeFalsy();
    expect(
      getByTestId(`row-col-01`).classList.contains('border-red-500')
    ).toBeFalsy();
  });

  it('should validate the Block, Column and Row after entering a number', async () => {
    const { getByTestId, getByRole } = render(<Home />);
    await waitFor(() => {
      getByRole('button', {
        name: 'Puzzle 4',
      });
    });

    const puzzle4Button = getByRole('button', {
      name: 'Puzzle 4',
    });
    await userEvent.click(puzzle4Button);
    await userEvent.click(getByTestId(`row-col-10`));

    await waitFor(() => getByTestId('numpad-box'));

    const numpad7 = getByRole('button', {
      name: '7',
    });

    await userEvent.click(numpad7);

    expect(getByTestId(`row-col-10`).textContent).toBe('7');

    expect(
      getByTestId(`row-col-10`).classList.contains('border-red-500')
    ).toBeTruthy();
    expect(
      getByTestId(`row-col-21`).classList.contains('border-red-500')
    ).toBeTruthy();
    expect(
      getByTestId(`row-col-18`).classList.contains('border-red-500')
    ).toBeTruthy();
    expect(
      getByTestId(`row-col-80`).classList.contains('border-red-500')
    ).toBeTruthy();
  });
});
