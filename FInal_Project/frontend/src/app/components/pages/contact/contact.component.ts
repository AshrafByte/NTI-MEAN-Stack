import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeroSectionComponent } from '../../ui/hero-section/hero-section.component';

interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  newsletter: boolean;
}

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  imports: [
    FormsModule,
    HeroSectionComponent
  ],
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactData: ContactData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    newsletter: false
  };

  isSubmitting = false;
  showSuccessMessage = false;

  faqs: FAQ[] = [
    {
      question: "What are your shipping options?",
      answer: "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Free shipping is available on orders over $50.",
      isOpen: false
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 30 days of purchase. Items must be in original condition with tags attached. Return shipping is free for defective items.",
      isOpen: false
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account on our website.",
      isOpen: false
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination.",
      isOpen: false
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team via phone at +1 (555) 123-4567, email at support@shopy.com, or through this contact form. We're available Monday-Friday 9am-6pm EST.",
      isOpen: false
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay for secure checkout.",
      isOpen: false
    }
  ];

  onSubmit(): void {
    if (this.isFormValid()) {
      this.isSubmitting = true;
      this.showSuccessMessage = false;


      setTimeout(() => {
        this.showSuccessMessage = true;
        this.isSubmitting = false;
        this.resetForm();

        // Hide success message after 3 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      }, 1000);
    }
  }

  private isFormValid(): boolean {
    return !!(this.contactData.firstName &&
             this.contactData.lastName &&
             this.contactData.email &&
             this.contactData.subject &&
             this.contactData.message);
  }

  private resetForm(): void {
    this.contactData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      newsletter: false
    };
  }

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
