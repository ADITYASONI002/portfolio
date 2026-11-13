import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContactForm } from './ContactForm';

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Ada');
  await user.type(screen.getByLabelText('Email'), 'ada@example.com');
  await user.type(screen.getByLabelText('Message'), 'Hello, I would like to discuss a backend role.');
}

describe('ContactForm', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('shows accessible errors and does not submit invalid input', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    render(<ContactForm email="me@example.com" navigate={navigate} />);

    await user.click(screen.getByRole('button', { name: /open in email app/i }));
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Name')).toHaveFocus();
    expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('falls back to a prefilled mailto link when no endpoint is configured', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    render(<ContactForm email="me@example.com" subjectPrefix="[Portfolio]" navigate={navigate} />);
    expect(screen.getByText(/opens your email app/i)).toBeInTheDocument();

    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /open in email app/i }));
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate.mock.calls[0][0]).toMatch(/^mailto:me%40example\.com\?subject=%5BPortfolio%5D/);
    expect(screen.getByText(/email app should now be open/i)).toBeInTheDocument();
  });

  it('posts to the configured endpoint and shows success', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactForm email="me@example.com" endpoint="https://formspree.io/f/test" />);

    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(fetchMock).toHaveBeenCalledWith('https://formspree.io/f/test', expect.objectContaining({ method: 'POST' }));
    expect(await screen.findByText(/message has been sent/i)).toBeInTheDocument();
  });

  it('reports endpoint failures with a direct email fallback', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    render(<ContactForm email="me@example.com" endpoint="https://formspree.io/f/test" />);

    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be sent/i);
  });
});
