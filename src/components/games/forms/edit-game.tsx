'use client';

import { useEditGame } from '@/hooks/edit-game';
import {
  MAX_GAME_DESCRIPTION_LENGTH,
  MAX_GAME_NAME_LENGTH,
} from '@/lib/definitions/constants';
import clsx from 'clsx';
import AddQuestionButton from './_ui/buttons/add-question';
import { Card, CardContent } from './_ui/card';
import {
  Field,
  FieldGroup,
  Fieldset,
  FileInput,
  Input,
  InputGroup,
  Label,
  Legend,
  Textarea,
  FieldsetContent,
  FieldsetAction,
} from './_ui/fieldset';
import { InputGameTags, SelectGameVisibility } from './_ui/controls';

export default function EditGameDetails() {
  const { game, setGame, setGameVisibility, onAddQuestion } = useEditGame();

  return (
    <Fieldset>
      <Legend>Game details</Legend>
      <FieldGroup>
        <FieldsetContent>
          {/* Game Image */}
          <div className="relative w-full">
            <Card className="w-full lg:max-w-lg">
              <CardContent>
                <FileInput
                  value={game.image || ''}
                  onChange={(e) => setGame({ ...game, image: e.target.value })}
                />
              </CardContent>
            </Card>
          </div>
          {/* Game Info */}
          <Card className="lg:flex lg:items-stretch relative w-full">
            <CardContent>
              <Field color="cyan">
                <Label htmlFor="game-name">Game name</Label>
                <InputGroup>
                  <Input
                    id="game-name"
                    type="text"
                    placeholder="Add a name..."
                    value={game.name}
                    onChange={(e) => setGame({ ...game, name: e.target.value })}
                    maxLength={MAX_GAME_NAME_LENGTH}
                    required
                />
                </InputGroup>
              </Field>
              <Field color="teal">
                <Label htmlFor="game-description">Game description</Label>
                <InputGroup>
                  <Textarea
                    id="game-description"
                    placeholder="Add a description..."
                    value={game.description || ''}
                    onChange={(e) =>
                      setGame({ ...game, description: e.target.value })
                    }
                    maxLength={MAX_GAME_DESCRIPTION_LENGTH}
                    rows={4}
                  />
                </InputGroup>
              </Field>
              <Field color="teal">
                <Label htmlFor="game-tags">Tags</Label>
                <InputGroup>
                  <InputGameTags id="game-tags" />
                </InputGroup>
              </Field>
              <SelectGameVisibility visibility={game.visibility} setVisibility={setGameVisibility} />
            </CardContent>
          </Card>
        </FieldsetContent>

        {/* Action Buttons */}
        <FieldsetAction className="flex justify-end">
          <AddQuestionButton
            gameId={game.id}
            onAddQuestion={onAddQuestion}
            className={clsx(game.questions.length === 0 && 'animate-beat')}
          />
        </FieldsetAction>
      </FieldGroup>
    </Fieldset>
  );
}
