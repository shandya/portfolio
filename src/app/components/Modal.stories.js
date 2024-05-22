import { action } from '@storybook/addon-actions';
import Modal from './Modal';

export default {
  title: 'Modal',  // Adjust the title to reflect the component path
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Portfolio = {
  args: {
    title: "Sample Title",
    description: "This is a sample description for the modal.",
    image: "https://via.placeholder.com/150",  // Provide a placeholder image URL
    isOpen: true,  // Set to true to make the modal visible by default
    onClose: action('onClose'),
  },
};