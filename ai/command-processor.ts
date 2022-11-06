import _ from "lodash-es";

enum Action {
  Replace = "replace",
  Add = "add",
  Delete = "delete",
  Translate = "translate"
}

enum FootageType {
  Text = "text",
  Video = "video",
  Audio = "audio",
  Solid = "solid",
}

export interface Command {
  action: Action;
  type: FootageType;
  value: string | null;
  time?: number;
}

const actionWords = [
  {
    action: Action.Replace,
    words: ["replace", "change", 'modify'],
  },
  {
    action: Action.Add,
    words: ["add"],
  },
  {
    action: Action.Delete,
    words: ["delete", "remove"],
  },
  {
    action: Action.Translate,
    words: ["translate"],
  },
];

const typeWords = [
  {
    type: FootageType.Video,
    words: ["media", "video", "footage"],
  },
  {
    type: FootageType.Audio,
    words: ["audio", "sound", "music"],
  },
  {
    type: FootageType.Solid,
    words: ["background", "solid"],
  },
  {
    type: FootageType.Text,
    words: ["text", "label", "caption", "title"],
  },
];

const valueSeparators = [' with ', ' of ', ' to ']

export const processCommand = (rawText: string): Command | null => {
  const text = rawText.toLocaleLowerCase();
  let value = null;

  const actionWord = actionWords.find((actionWord) => {
    const word = actionWord.words.find((word) => text.includes(word));
    if (word) {
      return true;
    }

    return false;
  });

  let footageType = typeWords.find((typeWord) => {
    const word = typeWord.words.find((word) => text.includes(word));
    if (word) {
      return true;
    }

    return false;
  });

  const separator = valueSeparators.find((sep) => text.includes(sep))
  if (separator) {
    value = _.last(rawText.split(separator)) || null;
  }


  console.log({actionWord,footageType});
  
  if (actionWord?.action === Action.Translate) {
    footageType = typeWords[3]
  }



  if (
    !actionWord ||
    !footageType ||
    (actionWord.action !== Action.Delete && value === null)
  ) {
    return null;
  }

  return {
    action: actionWord.action,
    type: footageType.type,
    value: value,
  };
};
