"use client";

import { createMuiThemeOptions } from "@/lib/muiUtils";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function MuiPreviewPage() {
  const json = useSearchParams().get("palette") || "";
  const palette = useMemo(() => {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }, [json]);
  const theme = useMemo(
    () => (palette ? createTheme(createMuiThemeOptions(palette)) : createTheme()),
    [palette]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Stack spacing={3}>
          {/* Headers */}
          <Typography variant="h3" gutterBottom>
            Material UI Preview
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Basic page composed with default Material UI components and theme.
          </Typography>

          {/* Sign-in form and feature cards */}
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h5">Sign in</Typography>
              <Alert severity="info">
                This is an inline message. Use your credentials to continue.
              </Alert>
              <TextField
                label="Email"
                type="email"
                name="do-not-autocomplete"
                fullWidth
                autoComplete="off"
              />
              <TextField
                label="Password"
                type="password"
                name="do-not-autocomplete"
                fullWidth
                autoComplete="off"
              />
              <FormControlLabel control={<Checkbox />} label="Remember me" />
              <Stack direction="row" spacing={2}>
                <Button variant="contained">Sign in</Button>
                <Button variant="text">Forgot password?</Button>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                By continuing you agree to our <Link href="#">Terms</Link> and{" "}
                <Link href="#">Privacy Policy</Link>.
              </Typography>
            </Stack>
          </Paper>

          <Stack spacing={2}>
            <Card variant="outlined">
              <CardHeader title="Essentials" subheader="Common components" />
              <CardContent>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Typography" secondary="Headings, body, captions" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Buttons" secondary="Contained, Outlined, Text" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Inputs" secondary="Text fields, checkboxes" />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions>
                <Button size="small">Learn more</Button>
              </CardActions>
            </Card>
            <Card variant="outlined">
              <CardHeader title="Layout" subheader="Stack, Container" />
              <CardContent>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Stack" secondary="Spacing between items" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Container" secondary="Centered content" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Box" secondary="Flex and layout primitives" />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions>
                <Button size="small">Explore</Button>
              </CardActions>
            </Card>
            <Card variant="outlined">
              <CardHeader title="Lists" subheader="Structured content" />
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Lists help organize related content using consistent formatting.
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Simple items" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Secondary text" secondary="Optional description" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Actions" secondary="Use CardActions for CTAs" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}
