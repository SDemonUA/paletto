'use client'

import { useEffect, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import { Container, CssBaseline } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { UITheme } from '../../../../lib/theme-utils'
// import './material.css'
import { deserializeWithColor } from '../../../../lib/utils'
import { createMuiThemeConfig } from '../../../../lib/theme-export'

export default function MaterialUIPreview() {
  const [theme, setTheme] = useState<UITheme | null>(null)
  const [muiTheme, setMuiTheme] = useState(createTheme())

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'SET_THEME') {
        const themeData = event.data.theme
        const deserializedTheme = deserializeWithColor(themeData) as UITheme
        setTheme(deserializedTheme)
      }
    })

    window.parent?.postMessage({ type: 'READY' }, '*')
  }, [])

  useEffect(() => {
    if (theme) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const muiTheme = createTheme(createMuiThemeConfig(theme) as any)
      setMuiTheme(muiTheme)
    }
  }, [theme])

  return (
    <div>
      {muiTheme && (
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <Container>
            {/* Typography Section */}
            <section>
              <Typography variant="h3" component="h1" gutterBottom>
                Typography
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 6 }}>
                <Typography variant="h1" gutterBottom>
                  Heading Level 1
                </Typography>
                <Typography variant="h2" gutterBottom>
                  Heading Level 2
                </Typography>
                <Typography variant="h3" gutterBottom>
                  Heading Level 3
                </Typography>
                <Typography variant="h4" gutterBottom>
                  Heading Level 4
                </Typography>

                <Typography variant="body1" sx={{ mt: 3, fontWeight: 500 }}>
                  Primary Text - The quick brown fox jumps over the lazy dog.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Secondary Text - The quick brown fox jumps over the lazy dog.
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                  Caption Text - The quick brown fox jumps over the lazy dog.
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, opacity: 0.5 }}>
                  Disabled Text - The quick brown fox jumps over the lazy dog.
                </Typography>
              </Box>
            </section>

            {/* Alerts Section */}
            <section>
              <Typography variant="h3" gutterBottom>
                Alerts
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Alert severity="info">
                  <AlertTitle>Information</AlertTitle>
                  This is a standard alert with important information.
                </Alert>

                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  Something went wrong! Please check your submission.
                </Alert>

                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Your changes have been saved successfully.
                </Alert>

                <Alert severity="warning">
                  <AlertTitle>Warning</AlertTitle>
                  Proceed with caution - this action cannot be undone.
                </Alert>
              </Box>
            </section>

            {/* Cards Section */}
            <section>
              <Typography variant="h3" gutterBottom>
                Cards
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader
                      title="Project Overview"
                      subheader="Get a summary of your project status"
                    />
                    <CardContent>
                      <Typography variant="body1">
                        Your project is currently 75% complete with 3 tasks
                        remaining.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader
                      title="Account Balance"
                      subheader="Your current account status"
                    />
                    <CardContent>
                      <Typography variant="h4" fontWeight="bold">
                        $1,234.56
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Last updated 3 hours ago
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </section>

            {/* Buttons Section */}
            <section>
              <Typography variant="h3" gutterBottom>
                Buttons
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Button variant="contained">Default Button</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="text">Text</Button>
                <Button variant="contained" color="secondary">
                  Secondary
                </Button>
                <Button variant="contained" color="error">
                  Error
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
                <Button variant="contained" disabled>
                  Disabled
                </Button>
                <Button variant="contained" size="small">
                  Small
                </Button>
                <Button variant="contained" size="large">
                  Large
                </Button>
                <Button
                  variant="contained"
                  sx={{ minWidth: 'initial', width: 40, height: 40 }}
                >
                  +
                </Button>
              </Box>
            </section>

            {/* Contact Form Section */}
            <section>
              <Typography variant="h3" gutterBottom>
                Contact Form
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Card sx={{ maxWidth: '700px', mx: 'auto' }}>
                <CardHeader
                  title="Get in touch"
                  subheader="Fill out the form below and we'll get back to you as soon as possible."
                />
                <CardContent>
                  <Box
                    component="form"
                    sx={{ '& .MuiTextField-root': { mt: 2 } }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          id="first-name"
                          label="First name"
                          placeholder="John"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          id="last-name"
                          label="Last name"
                          placeholder="Doe"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="email"
                          label="Email"
                          type="email"
                          placeholder="john.doe@example.com"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                          <InputLabel id="subject-label">Subject</InputLabel>
                          <Select
                            labelId="subject-label"
                            id="subject"
                            label="Subject"
                            defaultValue=""
                          >
                            <MenuItem value="general">General Inquiry</MenuItem>
                            <MenuItem value="support">
                              Technical Support
                            </MenuItem>
                            <MenuItem value="billing">
                              Billing Question
                            </MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="message"
                          label="Your message"
                          multiline
                          rows={5}
                          placeholder="Tell us how we can help..."
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Button variant="contained" fullWidth size="large">
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </section>
          </Container>
        </ThemeProvider>
      )}
    </div>
  )
}
