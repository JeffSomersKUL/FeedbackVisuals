import MarkdownParser from './MarkdownParser'
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import { ProcessedData } from 'Shared/data';

const dataHigh: ProcessedData = {
    passed: true,
    answers: [],
    scores: [{
        name: 'totaal',
        score: {
            score: 17,
            maxScore: 20,
            hasBreakdown: false
        }    
    }],
    feedbackCode: '',
    statistics: {
        amountOfParticipants: 10,
        subScoreStatistics: []
    },
    questionnaire: 1,
    config: {
        toetsCode: "wb",
        toetsSessie: 15,
        aantalVragen: 20,
        subscores: []
    }
}

const dataLow: ProcessedData = {
    passed: true,
    answers: [],
    scores: [{
        name: 'totaal',
        score: {
            score: 8,
            maxScore: 20,
            hasBreakdown: false
        }
    }],
    feedbackCode: '',
    statistics: {
        amountOfParticipants: 10,
        subScoreStatistics: []
    },
    questionnaire: 1,
    config: {
        toetsCode: "wb",
        toetsSessie: 15,
        aantalVragen: 20,
        subscores: []
    }
}

describe('MarkdownParser', () => {
    describe('checkConditionals', () => {
        it('works for valid conditions', () => {
            const tekst: string = 
            `BEGIN1[als "a" < "b" en 1 < 2][als 'tekst' != 'tekst']
            # content1
            BEGIN2[als 'b' >= 'b']
            content2
            EINDE2
            EINDE1`

            expect(MarkdownParser.checkConditionals(tekst)).toBe(true)
        })

        it('fails for string without quotes in outer if', () => {
            const tekst: string =
                `BEGIN1[als a < "b" en 1 < 2][als 'tekst' != 'tekst']
            # content1
            BEGIN2[als 'b' >= 'b']
            content2
            EINDE2
            EINDE1`

            expect(() => MarkdownParser.checkConditionals(tekst)).toThrow('a is geen geldig getal. Gebruik quotes ("") rond strings en @ voor variabelennamen.')
        })

        it('fails for string without quotes in inner if', () => {
            const tekst: string =
                `BEGIN1[als 'a' < "b" en 1 < 2][als 'tekst' != 'tekst']
            # content1
            BEGIN2[als b >= 'b']
            content2
            EINDE2
            EINDE1`

            expect(() => MarkdownParser.checkConditionals(tekst)).toThrow('b is geen geldig getal. Gebruik quotes ("") rond strings en @ voor variabelennamen.')
        })

        it('works with variables', () => {
            const tekst: string =
                `BEGIN1[als @score(totaal) > 10]
            Meer dan 10
            EINDE1
            BEGIN1[als @score(totaal) <= 10]
            Maximaal 10
            EINDE1`

            expect(MarkdownParser.checkConditionals(tekst)).toBe(true)
        })
    })

    describe('filterConditionals', () => {
        it('shows if all conditions are valid', () => {
            const tekst: string =
                `BEGIN1[als "a" < "b" en 1 < 2][als 'tekst' = 'tekst']
# content1 EINDE1`

            expect(MarkdownParser.filterConditionals(tekst)).toBe('# content1 ')
        })

        it('shows if one condition is valid', () => {
            const tekst: string =
                `BEGIN1[als "a" < "b" en 1 > 2][als 'tekst' = 'tekst']
# content1 EINDE1`

            expect(MarkdownParser.filterConditionals(tekst)).toBe('# content1 ')
        })

        it('hides if no condition is valid', () => {
            const tekst: string =
                `BEGIN1[als "a" < "b" en 1 > 2][als 'tekst' != 'tekst']
            # content1
            EINDE1`

            expect(MarkdownParser.filterConditionals(tekst)).toBe('')
        })

        it('hides inner if no condition is valid', () => {
            const tekst: string =
                `BEGIN1[als "a" < "b" en 1 < 2][als 'tekst' != 'tekst']
# content1BEGIN2[als "a" < "b" en 1 > 2][als 'tekst' != 'tekst']
            some tekst
EINDE2 EINDE1`

            expect(MarkdownParser.filterConditionals(tekst)).toBe('# content1 ')
        })

        it('works with numeric variables', () => {
            const tekst: string =
                `BEGIN1[als @score(totaal) > 10] Meer dan 10 EINDE1
                 BEGIN1[als @score(totaal) <= 10] Maximaal 10 EINDE1`

            expect(MarkdownParser.filterConditionals(tekst, dataHigh).trim()).toBe('Meer dan 10')
            expect(MarkdownParser.filterConditionals(tekst, dataLow).trim()).toBe('Maximaal 10')
        })

        it('throws when variable does not exist', () => {
            const tekst: string =
                `BEGIN1[als @student.advies = 'positief'] Leuk, positief EINDE1
                 BEGIN1[als @student.advies != 'positief'] Oei, niet positief EINDE1`
            expect(() => MarkdownParser.filterConditionals(tekst, dataHigh)).toThrow('Onbekende variable @student.advies.')
            expect(() => MarkdownParser.filterConditionals(tekst, dataLow)).toThrow('Onbekende variable @student.advies.')
        })
    })

    describe('parseText', () => {
        it('shows simple text', () => {
            const parsed = MarkdownParser.parseText('Test this with some text.')
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            const { getByText } = render(parsed);
            expect(getByText('Test this with some text.')).toBeInTheDocument();
        });

        it('shows right text for bold text', () => {
            const parsed = MarkdownParser.parseText('Test **this** with some **bold** text.')
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            const { container, getByText } = render(parsed);
            expect(container).toMatchSnapshot()
        });

        it('shows right text for italic text', () => {
            const parsed = MarkdownParser.parseText('Test _this_ with some _italic_ text.')
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            const { container, getByText } = render(parsed);
            expect(container).toMatchSnapshot()

        });

        it('shows right text for bold in italic text', () => {
            const parsed = MarkdownParser.parseText('Test _this with some **italic**_ text.')
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            const { container, getByText } = render(parsed);
            expect(container).toMatchSnapshot()

        });

        it('shows right text for italic in bold text', () => {
            const parsed = MarkdownParser.parseText('Test **this with some _bold_** text.')
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            const { container, getByText } = render(parsed);
            expect(container).toMatchSnapshot()

        });

        it('errors with not closed bold / italic text', () => {
            expect(() => MarkdownParser.parseText('Test **this with some _bold_ text.')).toThrow('Bold stars not closed in Test **this with some _bold_ text.') 
            expect(() => MarkdownParser.parseText('Test **this with some _bold** text.')).toThrow('Italic underscore not closed in this with some _bold')        
            expect(() => MarkdownParser.parseText('Test this with some _bold_** text.')).toThrow('Bold stars not closed in ** text.')
            expect(() => MarkdownParser.parseText('Test **this with some bold_** text.')).toThrow('Italic underscore not closed in this with some bold_') 
        });


    })

    describe('parseLinks', () => {
        it('parses a simple link', () => {
            const parsed = MarkdownParser.parseLinks('hi there [Linktekst](http://link.com)', false)
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            let { container, getByText } = render(parsed);
            expect(container).toMatchSnapshot()

            const parsed2 = MarkdownParser.parseLinks('hi there [Linktekst](http://link.com)', true)
            container = render(parsed2).container;
            expect(container).toMatchSnapshot()
        })

        it('parses two simple links', () => {
            const parsed = MarkdownParser.parseLinks('hi there [Linktekst1](http://link.com) and [Linktekst2](http://link.com)', false)
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            let { container, getByText } = render(parsed);
            expect(container).toMatchSnapshot()

            const parsed2 = MarkdownParser.parseLinks('hi there [Linktekst1](http://link.com) and [Linktekst2](http://link.com)', true)
            container = render(parsed2).container;
            expect(container).toMatchSnapshot()
        })

        it('parses boldness etc of two simple link names if needed', () => {
            const parsed = MarkdownParser.parseLinks('hi there [**Linktekst1**](http://link.com) and [_Linktekst2_](http://link.com)', false)
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            let { container, getByText } = render(parsed);
            expect(container).toMatchSnapshot()

            const parsed2 = MarkdownParser.parseLinks('hi there [**Linktekst1**](http://link.com) and [_Linktekst2_](http://link.com)', true)
            container = render(parsed2).container;
            expect(container).toMatchSnapshot()
        })

        it('parses link in title', () => {
            const parsed = MarkdownParser.parse('###### hi there [**Linktekst1**](http://link.com) and [_Linktekst2_](http://link.com)')
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            let { container, getByText } = render(parsed);
            expect(container).toMatchSnapshot()
        })
    })

    describe('parseLists', () => {
        it('parses a simple list with one items', () => {
            const parsed = MarkdownParser.parse(
                `- item`, undefined)
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            let { container, getByText } = render(parsed);
            expect(container).toMatchSnapshot()
        })

        it('parses a simple list with three items', () => {
            const parsed = MarkdownParser.parse(
`- item
- item2
- item3`, undefined)
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            let { container, getByText } = render(parsed);
            expect(container).toMatchSnapshot()
        })

        it('parses two lists', () => {
            const parsed = MarkdownParser.parse(
`
Text before
- one item
Text between
- item
- item2
- item3
Text After`, undefined)
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            let { container, getByText } = render(parsed);
            expect(container).toMatchSnapshot()
        })

        it('parses a simple list with three items and bold and underscored values', () => {
            const parsed = MarkdownParser.parse(
`- **item**
- _item2_
- item3`, undefined)
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            let { container, getByText } = render(parsed);
            expect(container).toMatchSnapshot()
        })
    })

    describe('parseMultiples', () => {
        it('works with 0', () => {
            const parsed = MarkdownParser.parseMultiples('<<<0 question/questions>>>', false)
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            let { container, getByText } = render(parsed);
            expect(container).toMatchSnapshot()

            const parsed2 = MarkdownParser.parseMultiples('<<<0 question/questions>>>', true)
            container = render(parsed2).container;
            expect(container).toMatchSnapshot()
        })

        it('works with 1', () => {
            const parsed = MarkdownParser.parseMultiples('<<<1 question/questions>>>', false)
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            let { container, getByText } = render(parsed);
            expect(container).toMatchSnapshot()

            const parsed2 = MarkdownParser.parseMultiples('<<<1 question/questions>>>', true)
            container = render(parsed2).container;
            expect(container).toMatchSnapshot()
        })

        it('works with 10', () => {
            const parsed = MarkdownParser.parseMultiples('<<<10 question/questions>>>', false)
            const div = document.createElement('div');
            // renders without crashing
            ReactDOM.render(parsed, div);

            let { container, getByText } = render(parsed);
            expect(container).toMatchSnapshot()

            const parsed2 = MarkdownParser.parseMultiples('<<<10 question/questions>>>', true)
            container = render(parsed2).container;
            expect(container).toMatchSnapshot()
        })
    })
})