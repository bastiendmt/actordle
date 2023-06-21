import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const FAQ = () => (
  <Accordion type='single' collapsible className='mt-40 w-full text-gray-600'>
    <AccordionItem value='item-1'>
      <AccordionTrigger className='w-full'>How to play ?</AccordionTrigger>
      <AccordionContent>
        Guess the name of the actor based on his picture. In the second round,
        you have to guess the movies he played in.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value='item-2'>
      <AccordionTrigger>When can I guess a new actor ?</AccordionTrigger>
      <AccordionContent>
        Every day a new actor is ready to be guessed.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value='item-3'>
      <AccordionTrigger>How are the data calculated ?</AccordionTrigger>
      <AccordionContent>
        Not all actors or movies are available in suggestion lists. Data is
        fetched from TMDB.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value='item-4'>
      <AccordionTrigger>Report a bug</AccordionTrigger>
      <AccordionContent>
        Feel free to report any issue 
        <a
          href='https://github.com/bastiendmt/actordle/issues'
          className='underline'
        >
          here
        </a>
        .
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);
