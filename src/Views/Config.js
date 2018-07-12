import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import '../App.css';
import '../Config.css'
import { SAVE_DONE, SAVE_ERROR, SAVE_PENDING, VISIBILITY_BUTTON_POSITIONS } from "../services/constants";

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Done from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import CachedIcon from '@material-ui/icons/Cached';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';

import * as Showdown from "showdown";
import ProgressBar from '../components/ProgressBar';
import InfoTabForm from '../components/InfoTabForm';
import TabsEditor from '../components/TabsEditor';
import AvatarButton from '../components/AvatarButton';
import BetterInformationPanel from './BetterInformationPanel';
import VideoComponentPreviewDialog from '../components/VideoComponentPreviewDialog';

// import DevTools from 'mobx-react-devtools';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  rootPaper: {
    height: '100%',
    background: theme.palette.background.default,
    paddingLeft: theme.spacing.unit,
  },
  paper: {
    textAlign: 'left',
  },
  panelPreviewPaper: {
    marginTop: theme.spacing.unit * 2,
    width: '327px',
    height: '502px',
    overflowX: 'hidden',
  },
  spacedContent: {
    marginLeft: theme.spacing.unit,
  },
  editorSection: {
    width: theme.spacing.unit * 40,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
  doneIcon: {
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 5,
  },
  divider: {
    marginBottom: theme.spacing.unit,
  },
  settingsAndSave: {
    marginTop: theme.spacing.unit * 5,
  },
  avatarTextField: {
    width: 200,
  },
  listItem: {
    paddingLeft: 0,
    paddingRight: 0,
  }
});

@observer
class ConfigView extends Component {
  propsTypes = {
    tabsStore: PropTypes.object.isRequired,
  };

  constructor(props) {
      super(props);
      this.state = {
          mdeState: null,
      };
      this.converter = new Showdown.Converter({tables: true, simplifiedAutoLink: true});
  }

  componentDidMount() {
    this.props.tabsStore.videoOverlayHeight = '230px';
  }

  onClickSave = () => {
    const { tabsStore } = this.props
    tabsStore.saveTabs();
  }

  handleVisibilityChange = (event) => {
    const { tabsStore } = this.props;
    tabsStore.setVideoComponentVisability(event.target.checked);
  }

  handleTransparentChange = (event) => {
    const { tabsStore } = this.props;
    tabsStore.setVideoComponentTransparency(event.target.checked);
  }

  handleCustomIconChange = (event) => {
    const { tabsStore } = this.props;
    tabsStore.setVideoToggleImageUrl(event.target.value);
  }

  handlePositionChange = (event) => {
    const { tabsStore } = this.props;
    tabsStore.setVideoToggleButtonPosition(event.target.value);
  }

  renderSaveState() {
    const { tabsStore, classes } = this.props;
    let jsx = null;
    switch (tabsStore.saveState) {
      case SAVE_PENDING:
        jsx = <CachedIcon className={classes.doneIcon} />
        break;
      case SAVE_DONE:
        jsx = <Done className={classes.doneIcon} />
        break;
      case SAVE_ERROR:
        jsx = <ErrorIcon className={classes.doneIcon} />
        break;
      default:
        break;
    }

    return jsx;
  }

  renderAvatarFormField() {
    const { classes, tabsStore } = this.props;
    return (
      <List>
        <ListItem className={classes.listItem}>
          <AvatarButton isVisible videoToggleImageUrl={tabsStore.videoToggleImageUrl} configView />
          <ListItemText>
            <TextField
              label="Visibility Toggle Icon Image"
              className={classes.avatarTextField}
              value={tabsStore.videoToggleImageUrl}
              onChange={this.handleCustomIconChange}
              margin="normal"
            />
            <FormHelperText>Enter URL for image you want to use</FormHelperText>
          </ListItemText>
        </ListItem>
      </List>
    );
  }

  renderVisibilityTogglePositionFormField() {
    const { tabsStore } = this.props;

    let selectedValue = tabsStore.videoToggleButtonPosition || 'BottomRight';

    return(
      <FormControl>
        <InputLabel htmlFor="visibility-position-helper">Visibility Button Position</InputLabel>
        <Select
          value={selectedValue} 
          onChange={this.handlePositionChange} 
          input={<Input name="visibility-position" id="visibility-position-helper" />}
        >
          { VISIBILITY_BUTTON_POSITIONS.map((position) => (
            <MenuItem value={position.value}>{ position.label }</MenuItem>
          ))}
        </Select>
        <FormHelperText>Select the location of button on the panel</FormHelperText>
      </FormControl>
    );
  }

  render() {
    const { classes, tabsStore } = this.props;

    return (
      <div className={classes.root}>
        <ProgressBar tabsStore={tabsStore} />
        <Paper className={classes.rootPaper}>
          {/* Tabs Creation */}
          <Typography variant="headline" gutterBottom>
            Add Tab
          </Typography>
          <Divider className={classes.divider} />
          <Grid container spacing={8}>
            <InfoTabForm tabsStore={tabsStore} />
          </Grid>
          <Grid container spacing={8}>
            {/* Markdown Editor Step*/}
            <Grid item md={4}>
              <Typography variant="headline" gutterBottom>
                Enter Markdown Text - <a href="https://simplemde.com/markdown-guide" target="_blank" rel="noopener noreferrer">Help</a>
              </Typography>
              <Divider className={classes.divider} />
              <section className={classes.editorSection}>
                <TabsEditor tabsStore={tabsStore} />
              </section>
            </Grid>
            {/* Extension Preview */}
            <Grid item md={4}>
              <Typography variant="headline" gutterBottom>
                Preview
              </Typography>
              <Divider className={classes.divider} />
              {/* VIDEO COMPONENT PREVIEW */}
              <div style={{ textAlign: 'center' }}>
                <VideoComponentPreviewDialog tabsStore={tabsStore} />
              </div>
              {/* PANEL PREVIEW */}
              <Paper className={classes.panelPreviewPaper}>
                <BetterInformationPanel configPreview={true} tabsStore={tabsStore} />
              </Paper>
            </Grid>
            {/* Configuration and Saving */}
            <Grid item md={2} className={classes.settingsAndSave}>
              <FormControl>
                <FormLabel component="legend">Video Component (Overlay) Settings:</FormLabel>
                {/* Show on load checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tabsStore.videoComponentVisibility}
                      onChange={this.handleVisibilityChange}
                      value="videoComponentVisibility"
                      color="primary"
                    />
                  }
                  label="Show on Channel Load"
                />
                {/* Transparent on Hover checkbox*/}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tabsStore.videoComponentTransparent}
                      onChange={this.handleTransparentChange}
                      value="videoComponentTransparent"
                      color="primary"
                    />
                  }
                  label="Make transparent when not in focus"
                />
                {/* Custom close avatar image */}
                {this.renderAvatarFormField()}
                {this.renderVisibilityTogglePositionFormField()}
              </FormControl>
              <Divider />
              <Button onClick={this.onClickSave} className={classes.button} variant="raised" color="primary">
                Save
                {this.renderSaveState()}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(ConfigView);

