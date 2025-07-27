namespace AuctionWebApp.DTOs
{
  public class EmailValidationFlag
  {
    public bool? value { get; set; }
    public string text { get; set; }
  }

  public class EmailValidationResult
  {
    public string email { get; set; }
    public string autocorrect { get; set; }
    public string deliverability { get; set; }
    public string quality_score { get; set; }

    public EmailValidationFlag is_valid_format { get; set; }
    public EmailValidationFlag is_free_email { get; set; }
    public EmailValidationFlag is_disposable_email { get; set; }
    public EmailValidationFlag is_role_email { get; set; }
    public EmailValidationFlag is_catchall_email { get; set; }
    public EmailValidationFlag is_mx_found { get; set; }
    public EmailValidationFlag is_smtp_valid { get; set; }
  }

}
