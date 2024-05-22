// fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { config } from '@fortawesome/fontawesome-svg-core';

// Prevent FontAwesome from dynamically adding its CSS since we will be adding it manually in our custom _app.js
config.autoAddCss = false;

// Add the icons to the library so you can use them in your components
library.add(fas, fab);