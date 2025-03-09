// Redirect to the first step of the wizard

import { redirect } from 'next/navigation'
import { ROUTES } from '../../constants'

export default function WizardPage() {
  redirect(ROUTES.WIZARD)
}
