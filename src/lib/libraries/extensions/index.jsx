import React from 'react';
import {FormattedMessage} from 'react-intl';

import musicImage from './music.png';
import musicInsetImage from './music-small.svg';
import penImage from './pen.png';
import penInsetImage from './pen-small.svg';
import videoImage from './video-sensing.png';
import videoInsetImage from './video-sensing-small.svg';
import translateImage from './translate.png';
import translateInsetImage from './translate-small.png';
import microbitImage from './microbit.png';
import ev3Image from './ev3.png';
import wedoImage from './wedo.png';
import text2speechImage from './text2speech.png';
import text2speechInsetImage from './text2speech-small.svg';
import makeymakeyImage from './makeymakey.png';
import makeymakeyInsetImage from './makeymakey-small.svg';
import twitterImage from './twitter_ext.jpg';
import twitterInsetImage from './twitter_ext.jpg';
import visionImage from './vision_ext.png';
import visionInsetImage from './vision_ext.png';
import textClassifyImage from './text_ext.png';
import textClassifyInsetImage from './text_ext.png';
import sentimentImage from './sentiment_ext.png';
import sentimentInsetImage from './sentiment-small.svg';
import alexaImage from './Alexa_extension.png';
import alexaInsetImage from './Alexa_extension.png';
import ergoImage from './Ergo_extension.png';
import ergoInsetImage from './Ergo_extension.png';
import cozmoImage from './cozmo-ext.png';
import cozmoInsetImage from './cozmo-small.jpg';
import speechImage from './speech-ext.jpg';
import speechInsetImage from './speech-inset.png';
import museImage from './Muse.png';
import museInsetImage from './muse_inset.png';
import microbitPeripheralImage from './peripheral-connection/microbit/microbit-illustration.svg';
import microbitMenuImage from './peripheral-connection/microbit/microbit-small.svg';
import ev3PeripheralImage from './peripheral-connection/ev3/ev3-small.svg';
import ev3MenuImage from './peripheral-connection/ev3/ev3-small.svg';
import wedoPeripheralImage from './peripheral-connection/wedo/wedo-illustration.svg';
import wedoMenuImage from './peripheral-connection/wedo/wedo-small.svg';
import wedoButtonImage from './peripheral-connection/wedo/wedo-button-illustration.svg';
import wemoMenuImage from './wemo_ext.png';
import wemoButtonImage from './wemo_ext.png';
import hueMenuImage from './Hue_extension.png';
import hueButtonImage from './Hue_extension.png';

export default [
    {
        name: (
            <FormattedMessage
                defaultMessage="Vision"
                description="Name for the 'Vision' extension"
                id="gui.extension.vision.name"
            />
        ),
        extensionId: 'vision',
        iconURL: visionImage,
        insetIconURL: visionInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="Vision Training"
                description="Description for the 'Vision' extension"
                id="gui.extension.vision.description"
            />
        ),
        featured: true,
        internetConnectionRequired: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Feeling"
                description="Name for the 'Feeling' extension"
                id="gui.extension.feeling.name"
            />
        ),
        extensionId: 'sentiment',
        iconURL: sentimentImage,
        insetIconURL: sentimentInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="Detect feelings"
                description="Description for the 'Feelings' extension"
                id="gui.extension.feeling.description"
            />
        ),
        featured: true,
        internetConnectionRequired: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Text"
                description="Name for the 'Text' extension"
                id="gui.extension.text.name"
            />
        ),
        extensionId: 'text',
        iconURL: textClassifyImage,
        insetIconURL: textClassifyInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="Use text in your projects"
                description="Description for the 'Text' extension"
                id="gui.extension.text.description"
            />
        ),
        featured: true
    },
    {
        name: "Cozmo",
        extensionId: 'cozmo',
        iconURL: cozmoImage,
        insetIconURL: cozmoInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="Cozmo Robot"
                description="Description for the 'Cozmo' extension"
                id="gui.extension.cozmo.description"
            />
        ),
        featured: true
    },
  {
      name: "Twitter",
      extensionId: 'twitter',
      iconURL: twitterImage,
      insetIconURL: twitterInsetImage,
      description: (
            <FormattedMessage
                defaultMessage="Use Twitter in your projects"
                description="Description for the 'Twitter' extension"
                id="gui.extension.twitter.description"
            />
        ),
      featured: true,
      internetConnectionRequired: true
  },
  {
        name: (
            <FormattedMessage
                defaultMessage="Music"
                description="Name for the 'Music' extension"
                id="gui.extension.music.name"
            />
        ),
        extensionId: 'music',
        iconURL: musicImage,
        insetIconURL: musicInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="Play instruments and drums."
                description="Description for the 'Music' extension"
                id="gui.extension.music.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Pen"
                description="Name for the 'Pen' extension"
                id="gui.extension.pen.name"
            />
        ),
        extensionId: 'pen',
        iconURL: penImage,
        insetIconURL: penInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="Draw with your sprites."
                description="Description for the 'Pen' extension"
                id="gui.extension.pen.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Video Sensing"
                description="Name for the 'Video Sensing' extension"
                id="gui.extension.videosensing.name"
            />
        ),
        extensionId: 'videoSensing',
        iconURL: videoImage,
        insetIconURL: videoInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="Sense motion with the camera."
                description="Description for the 'Video Sensing' extension"
                id="gui.extension.videosensing.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Text to Speech"
                description="Name for the Text to Speech extension"
                id="gui.extension.text2speech.name"
            />
        ),
        extensionId: 'text2speech',
        collaborator: 'Amazon Web Services',
        iconURL: text2speechImage,
        insetIconURL: text2speechInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="Make your projects talk."
                description="Description for the Text to speech extension"
                id="gui.extension.text2speech.description"
            />
        ),
        featured: true,
        internetConnectionRequired: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Translate"
                description="Name for the Translate extension"
                id="gui.extension.translate.name"
            />
        ),
        extensionId: 'translate',
        collaborator: 'Google',
        iconURL: translateImage,
        insetIconURL: translateInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="Translate text into many languages."
                description="Description for the Translate extension"
                id="gui.extension.translate.description"
            />
        ),
        featured: true,
        internetConnectionRequired: true
    },
    {
        name: 'Makey Makey',
        extensionId: 'makeymakey',
        collaborator: 'JoyLabz',
        iconURL: makeymakeyImage,
        insetIconURL: makeymakeyInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="Make anything into a key."
                description="Description for the 'Makey Makey' extension"
                id="gui.extension.makeymakey.description"
            />
        ),
        featured: true
    },
    {
        name: 'micro:bit',
        extensionId: 'microbit',
        collaborator: 'micro:bit',
        iconURL: microbitImage,
        insetIconURL: microbitMenuImage,
        description: (
            <FormattedMessage
                defaultMessage="Connect your projects with the world."
                description="Description for the 'micro:bit' extension"
                id="gui.extension.microbit.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        peripheralImage: microbitPeripheralImage,
        smallPeripheralImage: microbitMenuImage,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their micro:bit."
                id="gui.extension.microbit.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/microbit'
    },
    {
        name: 'LEGO MINDSTORMS EV3',
        extensionId: 'ev3',
        collaborator: 'LEGO',
        iconURL: ev3Image,
        insetIconURL: ev3MenuImage,
        description: (
            <FormattedMessage
                defaultMessage="Build interactive robots and more."
                description="Description for the 'LEGO MINDSTORMS EV3' extension"
                id="gui.extension.ev3.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        peripheralImage: ev3PeripheralImage,
        smallPeripheralImage: ev3MenuImage,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting. Make sure the pin on your EV3 is set to 1234."
                description="Message to help people connect to their EV3. Must note the PIN should be 1234."
                id="gui.extension.ev3.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/ev3'
    },
    {
        name: 'LEGO Education WeDo 2.0',
        extensionId: 'wedo2',
        collaborator: 'LEGO',
        iconURL: wedoImage,
        insetIconURL: wedoMenuImage,
        description: (
            <FormattedMessage
                defaultMessage="Build with motors and sensors."
                description="Description for the 'LEGO WeDo 2.0' extension"
                id="gui.extension.wedo2.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: true,
        peripheralImage: wedoPeripheralImage,
        smallPeripheralImage: wedoMenuImage,
        peripheralButtonImage: wedoButtonImage,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their WeDo."
                id="gui.extension.wedo2.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/wedo'

    },
    {
        name: "Alexa",
        extensionId: 'alexa',
        iconURL: alexaImage,
        insetIconURL: alexaInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="Play with Alexa and teach her new things"
                description="Description for the 'Alexa' extension"
                id="gui.extension.alexa.description"
            />
        ),
        featured: true
    },
    {
        name: "Ergo",
        extensionId: 'ergo',
        iconURL: ergoImage,
        insetIconURL: ergoInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="Play with Poppy Ergo Jr. and more!"
                description="Description for the 'Text' extension"
                id="gui.extension.ergo.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Speech to Text"
                description="Description for the 'speech' extension"
                id="gui.extension.speech.name"
            />
        ),
        extensionId: 'speech',
        iconURL: speechImage,
        insetIconURL: speechInsetImage,
        description: (
            <FormattedMessage
                defaultMessage="Talk to your projects!"
                description="Description for the 'Speech' extension"
                id="gui.extension.speech.description"
            />
        ),
        featured: true,
        internetConnectionRequired: true
    },
    {
        name: "Wemo",
        extensionId: 'wemo',
        iconURL: wemoMenuImage,
        insetIconURL: wemoButtonImage,
        description: (
            <FormattedMessage
                defaultMessage="Turn things on and off with Wemo!"
                description="Description for the 'Text' extension"
                id="gui.extension.wemo.description"
            />
        ), 
        featured: true, 
        internetConnectionRequired: true
    },
    { 
        name: "Muse",
        extensionId: 'muse',
        iconURL: museImage,
        insetIconURL: museInsetImage,
        description: "Muse",
        featured: true,
        internetConnectionRequired: true
    },
    { 
        name: (
            <FormattedMessage
                defaultMessage="Smart Lights"
                description="Name for 'Hue' extension"
                id="gui.extension.hue.name"
            />
        ),
        extensionId: 'hue',
        iconURL: hueMenuImage,
        insetIconURL: hueButtonImage,
        description: (
            <FormattedMessage
                defaultMessage="Hue"
                description="Description for 'Hue' extension"
                id="gui.extension.hue.description"
            />
        ),
        featured: true,
        internetConnectionRequired: true
    }
];
