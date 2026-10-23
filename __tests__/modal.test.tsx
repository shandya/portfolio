import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../src/app/components/Modal';

describe('Modal', () => {
  it('renders the description as formatted HTML', () => {
    const { container } = render(
      <Modal isOpen onClose={() => {}} title="Demo" description="<p>Hello <strong>bold</strong></p>" />,
    );
    expect(screen.getByRole('dialog', { name: 'Demo' })).toBeInTheDocument();
    expect(container.ownerDocument.querySelector('strong')).toHaveTextContent('bold');
    expect(screen.queryByText(/<strong>/)).not.toBeInTheDocument();
  });

  it('closes on Escape and on the close button', () => {
    const onClose = jest.fn();
    render(<Modal isOpen onClose={onClose} title="Demo" />);
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('ignores Escape while closed', () => {
    const onClose = jest.fn();
    render(<Modal isOpen={false} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});
