export interface Attributes {
  version: string;
  encoding: string;
}

export interface Declaration {
  _attributes: Attributes;
}

export interface Attributes2 {
  version: string;
}

export interface Attributes3 {
  id: string;
}

export interface Uuid {
  _text: string;
}

export interface Duration {
  _text: string;
}

export interface Timebase {
  _text: string;
}

export interface Ntsc {
  _text: string;
}

export interface Rate {
  timebase: Timebase;
  ntsc: Ntsc;
}

export interface Name {
  _text: string;
}

export interface Timebase2 {
  _text: string;
}

export interface Ntsc2 {
  _text: string;
}

export interface Rate2 {
  timebase: Timebase2;
  ntsc: Ntsc2;
}

export interface Name2 {
  _text: string;
}

export interface Appname {
  _text: string;
}

export interface Appmanufacturer {
  _text: string;
}

export interface Appversion {
  _text: string;
}

export interface Codecname {
  _text: string;
}

export interface Codectypename {
  _text: string;
}

export interface Codectypecode {
  _text: string;
}

export interface Codecvendorcode {
  _text: string;
}

export interface Spatialquality {
  _text: string;
}

export interface Temporalquality {
  _text: string;
}

export interface Keyframerate {
  _text: string;
}

export interface Datarate {
  _text: string;
}

export interface Qtcodec {
  codecname: Codecname;
  codectypename: Codectypename;
  codectypecode: Codectypecode;
  codecvendorcode: Codecvendorcode;
  spatialquality: Spatialquality;
  temporalquality: Temporalquality;
  keyframerate: Keyframerate;
  datarate: Datarate;
}

export interface Data {
  qtcodec: Qtcodec;
}

export interface Appspecificdata {
  appname: Appname;
  appmanufacturer: Appmanufacturer;
  appversion: Appversion;
  data: Data;
}

export interface Codec {
  name: Name2;
  appspecificdata: Appspecificdata;
}

export interface Width {
  _text: string;
}

export interface Height {
  _text: string;
}

export interface Anamorphic {
  _text: string;
}

export interface Pixelaspectratio {
  _text: string;
}

export interface Fielddominance {
  _text: string;
}

export interface Colordepth {
  _text: string;
}

export interface Samplecharacteristics {
  rate: Rate2;
  codec: Codec;
  width: Width;
  height: Height;
  anamorphic: Anamorphic;
  pixelaspectratio: Pixelaspectratio;
  fielddominance: Fielddominance;
  colordepth: Colordepth;
}

export interface Format {
  samplecharacteristics: Samplecharacteristics;
}

export interface Attributes4 {}

export interface Enabled {
  _text: string;
}

export interface Locked {
  _text: string;
}

export interface Track {
  _attributes: Attributes4;
  clipitem: any;
  enabled: Enabled;
  locked: Locked;
}

export interface Video {
  format: Format;
  track: Track[];
}

export interface NumOutputChannels {
  _text: string;
}

export interface Depth {
  _text: string;
}

export interface Samplerate {
  _text: string;
}

export interface Samplecharacteristics2 {
  depth: Depth;
  samplerate: Samplerate;
}

export interface Format2 {
  samplecharacteristics: Samplecharacteristics2;
}

export interface Index {
  _text: string;
}

export interface Numchannels {
  _text: string;
}

export interface Downmix {
  _text: string;
}

export interface Index2 {
  _text: string;
}

export interface Channel {
  index: Index2;
}

export interface Group {
  index: Index;
  numchannels: Numchannels;
  downmix: Downmix;
  channel: Channel;
}

export interface Outputs {
  group: Group[];
}

export interface Attributes5 {}

export interface Attributes6 {
  id: string;
  premiereChannelType: string;
}

export interface Masterclipid {
  _text: string;
}

export interface Name3 {
  _text: string;
}

export interface Enabled2 {
  _text: string;
}

export interface Duration2 {
  _text: string;
}

export interface Timebase3 {
  _text: string;
}

export interface Ntsc3 {
  _text: string;
}

export interface Rate3 {
  timebase: Timebase3;
  ntsc: Ntsc3;
}

export interface Start {
  _text: string;
}

export interface End {
  _text: string;
}

export interface In {
  _text: string;
}

export interface Out {
  _text: string;
}

export interface PproTicksIn {
  _text: string;
}

export interface PproTicksOut {
  _text: string;
}

export interface Attributes7 {
  id: string;
}

export interface Name4 {
  _text: string;
}

export interface Pathurl {
  _text: string;
}

export interface Timebase4 {
  _text: string;
}

export interface Ntsc4 {
  _text: string;
}

export interface Rate4 {
  timebase: Timebase4;
  ntsc: Ntsc4;
}

export interface Duration3 {
  _text: string;
}

export interface Timebase5 {
  _text: string;
}

export interface Ntsc5 {
  _text: string;
}

export interface Rate5 {
  timebase: Timebase5;
  ntsc: Ntsc5;
}

export interface String {
  _text: string;
}

export interface Frame {
  _text: string;
}

export interface Displayformat {
  _text: string;
}

export interface Timecode {
  rate: Rate5;
  string: String;
  frame: Frame;
  displayformat: Displayformat;
}

export interface Depth2 {
  _text: string;
}

export interface Samplerate2 {
  _text: string;
}

export interface Samplecharacteristics3 {
  depth: Depth2;
  samplerate: Samplerate2;
}

export interface Channelcount {
  _text: string;
}

export interface Audio2 {
  samplecharacteristics: Samplecharacteristics3;
  channelcount: Channelcount;
}

export interface Media2 {
  audio: Audio2;
}

export interface File {
  _attributes: Attributes7;
  name: Name4;
  pathurl: Pathurl;
  rate: Rate4;
  duration: Duration3;
  timecode: Timecode;
  media: Media2;
}

export interface Mediatype {
  _text: string;
}

export interface Trackindex {
  _text: string;
}

export interface Sourcetrack {
  mediatype: Mediatype;
  trackindex: Trackindex;
}

export interface Linkclipref {
  _text: string;
}

export interface Mediatype2 {
  _text: string;
}

export interface Trackindex2 {
  _text: string;
}

export interface Clipindex {
  _text: string;
}

export interface Groupindex {
  _text: string;
}

export interface Link {
  linkclipref: Linkclipref;
  mediatype: Mediatype2;
  trackindex: Trackindex2;
  clipindex: Clipindex;
  groupindex: Groupindex;
}

export interface Description {}

export interface Scene {}

export interface Shottake {}

export interface Lognote {}

export interface Good {}

export interface Originalvideofilename {}

export interface Originalaudiofilename {}

export interface Logginginfo {
  description: Description;
  scene: Scene;
  shottake: Shottake;
  lognote: Lognote;
  good: Good;
  originalvideofilename: Originalvideofilename;
  originalaudiofilename: Originalaudiofilename;
}

export interface Lut {}

export interface Lut1 {}

export interface AscSop {}

export interface AscSat {}

export interface Lut2 {}

export interface Colorinfo {
  lut: Lut;
  lut1: Lut1;
  asc_sop: AscSop;
  asc_sat: AscSat;
  lut2: Lut2;
}

export interface Label2 {
  _text: string;
}

export interface Labels {
  label2: Label2;
}

export interface Clipitem {
  _attributes: Attributes6;
  masterclipid: Masterclipid;
  name: Name3;
  enabled: Enabled2;
  duration: Duration2;
  rate: Rate3;
  start: Start;
  end: End;
  in: In;
  out: Out;
  pproTicksIn: PproTicksIn;
  pproTicksOut: PproTicksOut;
  file: File;
  sourcetrack: Sourcetrack;
  link: Link[];
  logginginfo: Logginginfo;
  colorinfo: Colorinfo;
  labels: Labels;
}

export interface Enabled3 {
  _text: string;
}

export interface Locked2 {
  _text: string;
}

export interface Outputchannelindex {
  _text: string;
}

export interface Track2 {
  _attributes: Attributes5;
  clipitem: Clipitem;
  enabled: Enabled3;
  locked: Locked2;
  outputchannelindex: Outputchannelindex;
}

export interface Audio {
  numOutputChannels: NumOutputChannels;
  format: Format2;
  outputs: Outputs;
  track: Track2[];
}

export interface SequenceMedia {
  video: Video;
  audio: Audio;
}

export interface Timebase6 {
  _text: string;
}

export interface Ntsc6 {
  _text: string;
}

export interface Rate6 {
  timebase: Timebase6;
  ntsc: Ntsc6;
}

export interface String2 {
  _text: string;
}

export interface Frame2 {
  _text: string;
}

export interface Displayformat2 {
  _text: string;
}

export interface Timecode2 {
  rate: Rate6;
  string: String2;
  frame: Frame2;
  displayformat: Displayformat2;
}

export interface Label22 {
  _text: string;
}

export interface Labels2 {
  label2: Label22;
}

export interface Description2 {}

export interface Scene2 {}

export interface Shottake2 {}

export interface Lognote2 {}

export interface Good2 {}

export interface Originalvideofilename2 {}

export interface Originalaudiofilename2 {}

export interface Logginginfo2 {
  description: Description2;
  scene: Scene2;
  shottake: Shottake2;
  lognote: Lognote2;
  good: Good2;
  originalvideofilename: Originalvideofilename2;
  originalaudiofilename: Originalaudiofilename2;
}

export interface Sequence {
  _attributes: Attributes3;
  uuid: Uuid;
  duration: Duration;
  rate: Rate;
  name: Name;
  media: SequenceMedia;
  timecode: Timecode2;
  labels: Labels2;
  logginginfo: Logginginfo2;
}

export interface Xmeml {
  _attributes: Attributes2;
  sequence: Sequence;
}

export interface ProjectObject {
  _declaration: Declaration;
  _doctype: string;
  xmeml: Xmeml;
}
